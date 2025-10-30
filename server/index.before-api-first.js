const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { spawn } = require("child_process");

/* --- Config --- */
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "alice:latest";
const BASE_DIR = process.env.ALICE_BASE_DIR || path.resolve(__dirname, "..");

/* --- App --- */
const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

/* --- Helpers --- */
function resolveSafe(relPath) {
  if (typeof relPath !== "string" || !relPath.trim()) {
    throw new Error("Missing or empty 'path'.");
  }
  const full = path.resolve(BASE_DIR, relPath);
  if (!full.startsWith(BASE_DIR)) throw new Error("Path escapes BASE_DIR.");
  return full;
}

/* --- Health FIRST (must be before static/catch-all) --- */
app.get("/health", (_req, res) => res.type("text/plain").send("ok"));

/* --- /chat: proxy Ollama /api/generate (NDJSON translate) --- */
app.post("/chat", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const userMsg = (req.body && req.body.message) || "";
    if (!userMsg) {
      res.write(JSON.stringify({ type: "error", message: "Missing 'message'." }) + "\n");
      res.write(JSON.stringify({ type: "done" }) + "\n");
      return res.end();
    }

    const upstream = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt: userMsg, stream: true }),
    });
    if (!upstream.ok || !upstream.body) throw new Error(`Upstream HTTP ${upstream.status}`);

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try {
          const evt = JSON.parse(line);
          if (typeof evt.response === "string" && evt.response.length > 0) {
            res.write(JSON.stringify({ type: "delta", content: evt.response }) + "\n");
          }
          if (evt.done === true) {
            res.write(JSON.stringify({ type: "done" }) + "\n");
          }
        } catch {}
      }
    }
  } catch (err) {
    res.write(JSON.stringify({ type: "error", message: String(err) }) + "\n");
    res.write(JSON.stringify({ type: "done" }) + "\n");
  } finally {
    res.end();
  }
});

/* --- /fs APIs --- */
app.post("/fs/list", (req, res) => {
  try {
    const rel = (req.body && req.body.path) || ".";
    const full = resolveSafe(rel);
    const items = fs
      .readdirSync(full, { withFileTypes: true })
      .map((d) => ({ name: d.name, type: d.isDirectory() ? "dir" : "file" }));
    res.json({ ok: true, base: BASE_DIR, path: rel, items });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

app.post("/fs/read", (req, res) => {
  try {
    const rel = req.body?.path;
    const full = resolveSafe(rel);
    const content = fs.readFileSync(full, "utf8");
    res.json({ ok: true, path: rel, bytes: Buffer.byteLength(content, "utf8"), content });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

app.post("/fs/write", (req, res) => {
  try {
    const rel = req.body?.path;
    const content = req.body?.content;
    if (content === undefined) throw new Error("Missing 'content'.");
    const full = resolveSafe(rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, String(content), "utf8");
    res.json({ ok: true, path: rel, bytes: Buffer.byteLength(String(content), "utf8") });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

/* --- /exec (NDJSON: stdout/stderr/exit/done) --- */
app.post("/exec", (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const cmd = req.body?.cmd;
    const args = Array.isArray(req.body?.args) ? req.body.args : [];
    const cwdRel = req.body?.cwd || ".";
    if (!cmd) {
      res.write(JSON.stringify({ type: "error", message: "Missing 'cmd'." }) + "\n");
      return res.end();
    }
    const cwd = resolveSafe(cwdRel);

    const child = spawn(cmd, args, { cwd, env: process.env, shell: false });

    child.stdout.on("data", (chunk) => {
      res.write(JSON.stringify({ type: "stdout", data: chunk.toString() }) + "\n");
    });
    child.stderr.on("data", (chunk) => {
      res.write(JSON.stringify({ type: "stderr", data: chunk.toString() }) + "\n");
    });
    child.on("error", (err) => {
      res.write(JSON.stringify({ type: "error", message: String(err) }) + "\n");
    });
    child.on("close", (code) => {
      res.write(JSON.stringify({ type: "exit", code }) + "\n");
      res.write(JSON.stringify({ type: "done" }) + "\n");
      res.end();
    });
  } catch (e) {
    res.write(JSON.stringify({ type: "error", message: String(e) }) + "\n");
    res.write(JSON.stringify({ type: "done" }) + "\n");
    res.end();
  }
});

/* --- Static + SPA catch-all (Express 5 safe) --- */
const clientDist = path.resolve(__dirname, "..", "client", "dist");
app.get(/^\/(?!api)(.*)/, (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
app.use(require("./routes/download"));
app.get("/__routes", (_req, res) => {
  const list = [];
  const stack = app && app._router && app._router.stack ? app._router.stack : [];
  stack.forEach(function (l) {
    if (l && l.route && l.route.path && l.route.methods) {
      var methods = Object.keys(l.route.methods)
        .map(function (m) {
          return m.toUpperCase();
        })
        .join(",");
      list.push(methods + " " + l.route.path);
    }
  });
  res.type("text/plain").send(list.join("\n"));
});
app.use(express.static(clientDist));
app.get(/^(?!\/(api|health|fs|exec|chat))(?!.*\.).*$/, (_req, res) =>
  res.sendFile(path.join(clientDist, "index.html"))
);
app.get("/__routes", (_req, res) => {
  const list = [];
  const s = app && app._router && app._router.stack ? app._router.stack : [];
  s.forEach(function (l) {
    if (l && l.route && l.route.path && l.route.methods) {
      var methods = Object.keys(l.route.methods)
        .map(function (m) {
          return m.toUpperCase();
        })
        .join(",");
      list.push(methods + " " + l.route.path);
    }
  });
  res.type("text/plain").send(list.join("\n"));
});
