const fs = require("fs");
const path = require("path");
const http = require("http");
const { execFileSync } = require("child_process");

console.log("🤖 Asking local Ollama (alice:latest) for the next creative idea...");
const payload = JSON.stringify({
  model: "alice:latest",
  prompt: "Suggest one new improvement for the Alice project in one or two sentences.",
  stream: false,
});

function appendIdea(idea) {
  const road = "D:/Alice/projects/chat-app/docs/ROADMAP.md";
  const line = `- ${new Date().toISOString()} ${idea}\n`;
  try {
    fs.mkdirSync(path.dirname(road), { recursive: true });
    if (!fs.existsSync(road)) fs.writeFileSync(road, "# Alice Creative Roadmap\n", "utf8");
    fs.appendFileSync(road, line, "utf8");
    console.log("🧠 Idea saved to ROADMAP.md");
  } catch (e) {
    console.error("⚠️ Failed to write roadmap:", e.message);
  }
}

const req = http.request(
  {
    hostname: "127.0.0.1",
    port: 11434,
    path: "/api/generate",
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
  },
  (res) => {
    let body = "";
    res.on("data", (c) => (body += c));
    res.on("end", () => {
      try {
        const out = JSON.parse(body);
        const idea = out && out.response ? out.response : String(body).trim();
        appendIdea(idea);
      } catch {
        appendIdea(String(body).trim());
      }
      // ➜ Chain the writer immediately in the SAME tick:
      try {
        const writer = path.join(__dirname, "write-feature.cjs");
        console.log("✍️  Calling write-feature.cjs...");
        execFileSync(process.execPath, [writer], { stdio: "inherit" });
        console.log("✅ plan→write chain complete.");
      } catch (e) {
        console.error("⚠️ write-feature failed:", e.message);
      }
    });
  }
);
req.on("error", (e) => console.error("Request error:", e.message));
req.write(payload);
req.end();
