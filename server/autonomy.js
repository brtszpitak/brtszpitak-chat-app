const fs = require("fs");
const path = require("path");
const cp = require("child_process");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function readJson(p, dflt) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return dflt;
  }
}
function writeJson(p, obj) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(obj, null, 2, null, 2));
}

const ROOT = path.join(__dirname, "..");
const LOGS = path.join(__dirname, "logs");
const STATE = path.join(__dirname, "state.json");
const LAST = path.join(LOGS, "lastTick.json");

ensureDir(LOGS);

let busy = false; // simple in-process lock

const tasks = [
  {
    name: "plan-feature",
    cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\plan-feature.cjs"',
  },
  {
    name: "write-feature",
    cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\write-feature.cjs"',
  },
  { name: "test-all", cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\test-all.cjs"' },
  { name: "format-server", cmd: 'npm --prefix "D:\\Alice\\projects\\chat-app\\server" run format' },
  { name: "lint-server", cmd: 'npm --prefix "D:\\Alice\\projects\\chat-app\\server" run lint' },
  {
    name: "maybe-pack",
    cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\maybe-pack.cjs" "D:\\Alice\\projects\\chat-app\\server" "D:\\Alice\\projects\\chat-app\\server\\..\\desktop-app"',
  },
  {
    name: "maybe-dist",
    cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\maybe-dist.cjs" "D:\\Alice\\projects\\chat-app\\server" "D:\\Alice\\projects\\chat-app\\server\\..\\desktop-app"',
  },
  {
    name: "rotate-logs",
    cmd: 'node "D:\\Alice\\projects\\chat-app\\server\\scripts\\rotate-logs.cjs"',
  },
  {
    name: "note-progress",
    cmd: "powershell -NoProfile -Command \"Add-Content -Encoding UTF8 'D:\Alice\projects\chat-app\\docs\\NEXT_PHASE_LOG.md' ('- ' + (Get-Date).ToString('s') + ' – creative tick complete')\"",
  },
];

function runOne(t) {
  if (t.run) return t.run();
  const opts = { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: !!t.shell };
  try {
    const out = cp.execSync(t.cmd, opts);
    return { stdout: out || "", code: 0 };
  } catch (e) {
    if (t.allowFail)
      return { stdout: String(e.stderr || e.stdout || e.message || e), code: e.status ?? 1 };
    throw e;
  }
}

async function runTick() {
  if (busy) {
    const prev = readJson(LAST, { ok: true, ts: new Date().toISOString(), count: 0 });
    return { ok: true, skipped: true, reason: "busy", last: prev };
  }
  busy = true;
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const ndjson = path.join(LOGS, `autonomy-${day}.ndjson`);

  // state
  const st = readJson(STATE, { i: 0, count: 0 });
  const task = tasks[st.i % tasks.length];

  // start log
  const start = { ts: now.toISOString(), phase: "start", ok: true, task: task.name };
  fs.appendFileSync(ndjson, JSON.stringify(start, null, 2) + "\n", "utf8");

  // work
  let result,
    ok = true,
    errMsg = null;
  try {
    result = runOne(task);
  } catch (e) {
    ok = false;
    errMsg = e && e.message ? e.message : String(e);
    result = { stdout: String(e.stdout || ""), code: e.status ?? 1 };
  }

  // heartbeat file (proof of edit)
  const hbPath = path.join(ROOT, "client", "dist", "autonomy_heartbeat.txt");
  fs.writeFileSync(
    hbPath,
    `tick ${now.toISOString()} Ã¢â‚¬â€œ ${task.name} (code ${result.code})\n`,
    "utf8"
  );

  // advance state
  const next = {
    i: (st.i + 1) % tasks.length,
    count: (st.count | 0) + 1,
    lastTask: task.name,
    lastCode: result.code,
  };
  writeJson(STATE, next);

  // status file for /autonomy/status
  writeJson(LAST, {
    ok,
    ts: now.toISOString(),
    count: next.count,
    wrote: "client/dist/autonomy_heartbeat.txt",
    task: task.name,
    code: result.code,
  });

  // end log (truncate stdout to keep logs light)
  const tail = (result.stdout || "").toString().slice(0, 4000);
  const end = {
    ts: now.toISOString(),
    phase: "end",
    ok,
    task: task.name,
    code: result.code,
    out: tail,
  };
  if (!ok) end.error = errMsg;
  fs.appendFileSync(ndjson, JSON.stringify(end, null, 2) + "\n", "utf8");

  busy = false;
  return { ok, task: task.name, code: result.code, wrote: path.basename(hbPath) };
}

module.exports = { runTick };
