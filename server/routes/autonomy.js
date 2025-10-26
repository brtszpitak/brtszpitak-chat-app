import { Router } from "express";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const router = Router();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const BASE_DIR = process.env.ALICE_BASE_DIR || path.resolve(process.cwd(), "..");
const PLAN_PATH = path.resolve(BASE_DIR, "plan.json");
const LOG_DIR = path.resolve(BASE_DIR, "logs");
const MAX_LOG_BYTES = 5 * 1024 * 1024; // 5 MB per daily log

fs.mkdirSync(LOG_DIR, { recursive: true });

// --- utils ---
async function readPlan() {
  try {
    const raw = await fsp.readFile(PLAN_PATH, "utf8");
    const clean = raw.replace(/^\uFEFF/, ""); // strip BOM
    return JSON.parse(clean);
  } catch {
    return { version: 1, tasks: [] };
  }
}
async function writePlan(plan) {
  await fsp.writeFile(PLAN_PATH, JSON.stringify(plan, null, 2), "utf8");
}
function getNextTodo(plan) {
  return plan.tasks.find(t => (t.status ?? "todo") === "todo");
}
function dailyLogPath() {
  const ymd = new Date().toISOString().slice(0,10).replace(/-/g,"");
  return path.join(LOG_DIR, `autonomy-${ymd}.ndjson`);
}
function appendLog(obj) {
  const p = dailyLogPath();
  try {
    const msg = JSON.stringify({ ts: new Date().toISOString(), ...obj }) + "\n";
    let ok = true;
    try {
      const st = fs.existsSync(p) ? fs.statSync(p) : { size: 0 };
      if ((st.size + Buffer.byteLength(msg, "utf8")) > MAX_LOG_BYTES) ok = false;
    } catch {}
    if (ok) fs.appendFileSync(p, msg, "utf8");
  } catch {}
}
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function withTimeout(run, ms, label="task") {
  const ac = new AbortController();
  const t = setTimeout(()=>ac.abort(`Timeout after ${ms}ms: ${label}`), ms);
  try { return await run(ac.signal); }
  finally { clearTimeout(t); }
}
async function postJSON(url, body, signal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body||{}),
    signal
  });
  return res;
}
async function parseNdjsonStream(res) {
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const events = [];
  for (const line of lines) {
    try { events.push(JSON.parse(line)); } catch {}
  }
  return events;
}

// --- task runners ---
async function runDownload(task, signal) {
  const body = { url: task.url };
  if (task.expectedSha256) body.expectedSha256 = task.expectedSha256;
  const res = await postJSON(`http://127.0.0.1:${PORT}/download`, body, signal);
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(`download failed: ${data.error||"unknown"}`);
  return data;
}

async function runExec(task, signal) {
  // Support { cmd:"node", args:["-v"] } OR { cmd:"node -v" }
  let cmd = task.cmd, args = Array.isArray(task.args) ? task.args.slice() : [];
  if (typeof cmd === "string" && args.length === 0 && /\s/.test(cmd)) {
    const parts = cmd.match(/\S+/g) || [];
    cmd = parts.shift();
    args = parts;
  }
  const body = { cmd, args, cwd: task.cwd || "." };
  const res = await postJSON(`http://127.0.0.1:${PORT}/exec`, body, signal);
  if (!res.ok) throw new Error(`exec HTTP ${res.status}`);
  const events = await parseNdjsonStream(res);
  const exit = events.find(e=>e.type==="exit")?.code ?? null;
  const stdout = events.filter(e=>e.type==="stdout").map(e=>e.data).join("");
  const stderr = events.filter(e=>e.type==="stderr").map(e=>e.data).join("");
  return { exit, stdout, stderr };
}

async function runWrite(task, _signal) {
  const rel = task.rel || task.path;
  if (!rel) throw new Error("write: missing 'rel' (path)");
  const outPath = path.resolve(BASE_DIR, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, String(task.content ?? ""), "utf8");
  const bytes = Buffer.byteLength(String(task.content ?? ""), "utf8");
  return { ok:true, path: rel, bytes };
}

async function runOnceWithRetry(task, fn, { tries=2, delayMs=400 } = {}) {
  let lastErr;
  for (let i=0;i<tries;i++){
    try { return await fn(); }
    catch (e){ lastErr = e; if (i < tries-1) await sleep(delayMs); }
  }
  throw lastErr;
}

async function executeTask(task) {
  const startedAt = Date.now();
  appendLog({ level:"info", event:"task.start", id:task.id, action:task.action, title:task.title });

  let result;
  try {
    if (task.action === "download") {
      result = await withTimeout(
        (signal)=>runOnceWithRetry(task, ()=>runDownload(task, signal)),
        30_000, `download:${task.id}`
      );
    } else if (task.action === "exec") {
      result = await withTimeout(
        (signal)=>runOnceWithRetry(task, ()=>runExec(task, signal)),
        (task.timeoutMs ?? 60_000), `exec:${task.id}`
      );
      if (typeof result.exit === "number" && result.exit !== 0) {
        throw new Error(`exec non-zero exit: ${result.exit}`);
      }
    } else if (task.action === "write") {
      result = await withTimeout(
        (signal)=>runOnceWithRetry(task, ()=>runWrite(task, signal)),
        15_000, `write:${task.id}`
      );
    } else {
      throw new Error(`Unknown action: ${task.action}`);
    }

    const ms = Date.now() - startedAt;
    appendLog({ level:"info", event:"task.ok", id:task.id, ms, summary: (task.action==="exec" ? (result.stdout||"").slice(0,200) : result) });
    return { ok:true, result, ms };
  } catch (err) {
    const ms = Date.now() - startedAt;
    appendLog({ level:"error", event:"task.fail", id:task.id, ms, error:String(err) });
    return { ok:false, error:String(err), ms };
  }
}

// --- routes ---
router.post("/tick", async (_req, res) => {
  const plan = await readPlan();
  const t = getNextTodo(plan);
  if (!t) {
    appendLog({ level:"debug", event:"idle" });
    return res.json({ status: "idle", message: "No tasks", log: dailyLogPath() });
  }

  const execResult = await executeTask(t);
  t.history = t.history || [];
  t.history.push({
    ts: new Date().toISOString(),
    note: execResult.ok ? "done" : `failed: ${execResult.error}`,
  });
  t.status = execResult.ok ? "done" : "failed";
  await writePlan(plan);

  res.json({
    status: execResult.ok ? "ok" : "error",
    id: t.id,
    action: t.action,
    ms: execResult.ms,
    result: execResult.ok ? execResult.result : undefined,
    error: execResult.ok ? undefined : execResult.error,
    log: dailyLogPath(),
  });
});

router.post("/loop", async (req, res) => {
  const { max = 50 } = req.body || {};
  const run = [];
  for (let i=0; i<max; i++){
    const r = await (await fetch(`http://127.0.0.1:${PORT}/autonomy/tick`, { method:"POST" })).json();
    run.push(r);
    if (r.status === "idle") break;
  }
  res.json({ status:"ok", run });
});

export default router;



