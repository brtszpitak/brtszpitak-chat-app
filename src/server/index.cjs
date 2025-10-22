const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SERVER_PORT } = require("../shared/constants.cjs");

// --- app setup ---
const app = express();
app.use(cors());
app.use(express.json());

// --- tiny logger (optional) ---
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const today = () => new Date().toISOString().slice(0,10).replace(/-/g,"");
const stamp = () => new Date().toISOString().replace("T"," ").slice(0,19);
const logLine = (line) => fs.appendFile(
  path.join(LOG_DIR, `autonomy-${today()}.log`),
  `${stamp()} | ${line}\n`,
  ()=>{}
);

// --- health ---
app.get("/health", (_, res) => res.json({ ok: true }));

// --- /chat stub (NDJSON-ish) ---
app.post("/chat", (req, res) => {
  const body = req.body || {};
  const msg = body.message || (Array.isArray(body.messages) ? (body.messages.at(-1)?.content || "") : "");
  logLine(`/chat | ${String(msg).slice(0,200).replace(/\s+/g," ") || "(no message)"}`);
  res.setHeader("Content-Type","application/x-ndjson; charset=utf-8");
  res.write(JSON.stringify({ type: "delta", content: "OK" })+"\n");
  res.end(JSON.stringify({ type: "done" })+"\n");
});

// --- helpers for task runner ---
const ALLOW_CMDS = [
  /^git\s+(init|status|add\s+-A|commit\s+-m\s+"[^"]+")$/,
  /^npm\s+init\s+-y$/,
  /^npm\s+i(\s+--save(-dev)?|\s+-D)?\s+[@\w\-./]+(\s+[@\w\-./]+)*$/,
  /^npm\s+run\s+[\w:-]+$/,            // allow "npm run smoke" etc
  /^node\s+\.\/src\/server\/index\.cjs$/,
  /^npx\s+vite$/,
  /^npx\s+electron\s+\.$/
];

const isInsideRepo = (rel) => {
  const abs = path.resolve(process.cwd(), rel);
  return abs.startsWith(process.cwd() + path.sep);
};

function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    if (!ALLOW_CMDS.some(rx => rx.test(cmd))) return reject(new Error(`blocked cmd: ${cmd}`));
    logLine(`run | ${cmd}`);
    const { spawn } = require("child_process");
    const p = spawn(cmd, { cwd: process.cwd(), shell: true });
    let out = "", err = "";
    p.stdout.on("data", d => { out += d.toString(); });
    p.stderr.on("data", d => { err += d.toString(); });
    p.on("error", e => reject(e));
    p.on("close", code => {
      logLine(`done | ${cmd} | code=${code}`);
      code === 0 ? resolve({ code, out, err }) : reject(new Error(err || out || `exit ${code}`));
    });
  });
}

async function writeFileSafe(rel, content) {
  if (!isInsideRepo(rel)) throw new Error(`path escapes repo: ${rel}`);
  const abs = path.resolve(process.cwd(), rel);
  await fs.promises.mkdir(path.dirname(abs), { recursive: true });
  await fs.promises.writeFile(abs, content ?? "", "utf8");
  logLine(`write | ${rel} | ${Buffer.byteLength(content ?? "", "utf8")} bytes`);
}

// --- /run (streaming NDJSON; good for curl -N) ---
app.post("/run", async (req, res) => {
  const tasks = Array.isArray(req.body?.tasks) ? req.body.tasks : [];
  res.setHeader("Content-Type","application/x-ndjson; charset=utf-8");
  try {
    for (const t of tasks) {
      if (t.kind === "cmd") {
        await runCmd(t.cmd);
        res.write(JSON.stringify({ type:"delta", content:`STATUS: ran ${t.cmd}` })+"\n");
      } else if (t.kind === "write") {
        await writeFileSafe(t.rel, t.content ?? "");
        res.write(JSON.stringify({ type:"delta", content:`STATUS: wrote ${t.rel}` })+"\n");
      } else {
        throw new Error(`unknown task kind: ${t.kind}`);
      }
    }
  } catch (e) {
    res.write(JSON.stringify({ type:"delta", content:`STATUS: error: ${String(e)}` })+"\n");
  } finally {
    res.end(JSON.stringify({ type:"done" })+"\n");
  }
});

// --- /runOnce (non-streaming; friendly to Invoke-RestMethod) ---
app.post("/runOnce", async (req, res) => {
  const tasks = Array.isArray(req.body?.tasks) ? req.body.tasks : [];
  try {
    const results = [];
    for (const t of tasks) {
      if (t.kind === "cmd") {
        const r = await runCmd(t.cmd);
        results.push({ ok: true, kind: "cmd", cmd: t.cmd, code: r.code });
      } else if (t.kind === "write") {
        await writeFileSafe(t.rel, t.content ?? "");
        results.push({ ok: true, kind: "write", rel: t.rel });
      } else {
        throw new Error(`unknown task kind: ${t.kind}`);
      }
    }
    const body = JSON.stringify({ ok: true, results });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Connection", "close");
    res.setHeader("Content-Length", Buffer.byteLength(body));
    res.end(body);
  } catch (e) {
    const body = JSON.stringify({ ok: false, error: String(e) });
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Connection", "close");
    res.setHeader("Content-Length", Buffer.byteLength(body));
    res.end(body);
  }
});

// --- sockets (pong for UI button) ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  socket.on("ping", (msg) => socket.emit("pong", msg ?? "pong"));
});

// --- start ---
const PORT = process.env.PORT || SERVER_PORT || 3001;
server.listen(PORT, () => {
  console.log("[server] listening on", PORT);
  logLine(`server | listening on ${PORT}`);
});
