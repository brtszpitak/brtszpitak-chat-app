const express = require("express");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// --- Mock streaming /chat endpoint (NDJSON) ---
app.post("/chat", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const userMsg = req.body?.message || "";
  const parts = [
    "Hi there! ",
    "You said: ",
    JSON.stringify(userMsg),
    ". ",
    "This is a demo ",
    "streaming ",
    "reply.",
  ];

  let i = 0;
  const timer = setInterval(() => {
    if (i < parts.length) {
      res.write(JSON.stringify({ type: "delta", content: parts[i++] }) + "\n");
    } else {
      clearInterval(timer);
      res.write(JSON.stringify({ type: "done" }) + "\n");
      res.end();
    }
  }, 150);
});

// --- Serve the built client and SPA catch-all ---
const clientDist = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api)(.*)/, (_, res) => res.sendFile(path.join(clientDist, "index.html")));
app.use(require('./routes/download'));
