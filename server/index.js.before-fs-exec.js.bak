const express = require("express");
const path = require("path");
const cors = require("cors");

// --- Config ---
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "alice:latest"; // change if needed

const app = express();
app.use(cors());
app.use(express.json());

// Optional request log
app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

// --- /chat: proxy Ollama stream → NDJSON for the client ---
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

    // Call Ollama /api/generate (streams {"response":"…","done":false} … {"done":true})
    const upstream = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: userMsg,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      throw new Error(`Upstream HTTP ${upstream.status}`);
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // Ollama streams newline-delimited JSON
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;

        try {
          const evt = JSON.parse(line);

          // Translate to our client schema
          if (typeof evt.response === "string" && evt.response.length > 0) {
            res.write(JSON.stringify({ type: "delta", content: evt.response }) + "\n");
          }
          if (evt.done === true) {
            res.write(JSON.stringify({ type: "done" }) + "\n");
          }
        } catch (e) {
          // If Ollama ever emits a non-JSON line, ignore it
        }
      }
    }
  } catch (err) {
    res.write(JSON.stringify({ type: "error", message: String(err) }) + "\n");
    res.write(JSON.stringify({ type: "done" }) + "\n");
  } finally {
    res.end();
  }
});

// --- Serve the built client and SPA catch-all ---
const clientDist = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
// Express 5-safe catch-all using a regex (avoids path-to-regexp "*")
app.get(/^\/(?!api)(.*)/, (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
