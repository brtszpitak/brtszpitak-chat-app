// D:\Alice\projects\chat-app\server\index.js
const express = require("express");
const path = require("path");

const PORT = 3001;
const OLLAMA_URL = "http://127.0.0.1:11434";
const MODEL_NAME = "alice:latest"; // or "llama3.1:8b" / "llama3:70b"

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

app.get("/ollama/version", async (_, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/version`);
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/chat", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Transfer-Encoding", "chunked");
  res.flushHeaders?.();

  const userMessage = String(req.body?.message ?? "");
  const systemPrompt =
    req.body?.system ??
    "You are Alice, Bartosz’s helpful local AI. Be concise, friendly, and accurate.";

  const payload = {
    model: MODEL_NAME,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  };

  const send = (obj) => {
    try {
      res.write(JSON.stringify(obj) + "\n");
    } catch (_) {}
  };

  send({ type: "start", id: Date.now().toString() });

  let aborted = false;
  req.on("close", () => (aborted = true));

  try {
    const upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok || !upstream.body) {
      send({ type: "error", message: `Upstream HTTP ${upstream.status}` });
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (!aborted) {
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
          if (evt.message?.content) send({ type: "delta", content: evt.message.content });
          if (evt.done === true) send({ type: "done" });
        } catch {}
      }
    }
  } catch (err) {
    send({ type: "error", message: String(err) });
  } finally {
    res.end();
  }
});

// Serve built client
const clientDist = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api)(.*)/, (_, res) => res.sendFile(path.join(clientDist, "index.html")));
app.use(require("./routes/download"));
