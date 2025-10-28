const fs = require("fs");
const path = require("path");
const http = require("http");
const { execFileSync } = require("child_process");

console.log("✍️  Asking local Ollama (alice:latest) to generate new feature code...");

function lastRoadmapIdea() {
  try {
    const lines = fs
      .readFileSync("D:/Alice/projects/chat-app/docs/ROADMAP.md", "utf8")
      .trim()
      .split("\n")
      .filter(Boolean);
    return (
      lines[lines.length - 1] ||
      "Create a small self-contained Node.js feature for the Alice project."
    );
  } catch {
    return "Create a small self-contained Node.js feature for the Alice project.";
  }
}

function logTest(file, ok, out, err) {
  try {
    const logsDir = "D:/Alice/projects/chat-app/server/logs";
    fs.mkdirSync(logsDir, { recursive: true });
    const rec = { ts: new Date().toISOString(), phase: "generated-test", file, ok, out, err };
    fs.appendFileSync(
      path.join(logsDir, "generated-tests.ndjson"),
      JSON.stringify(rec) + "\n",
      "utf8"
    );
  } catch {}
}

const ideaLine = lastRoadmapIdea();
const payload = JSON.stringify({
  model: "alice:latest",
  prompt: `Based on this roadmap idea, write **one** runnable CommonJS (.cjs) Node.js script. Respond with code only (no backticks, no explanation). It must run with "node" without extra files.\nIdea:\n${ideaLine}`,
  stream: false,
});

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
        const j = JSON.parse(body);
        const code = j.response || body;
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const file = `D:/Alice/projects/chat-app/server/scripts/generated-${ts}.cjs`;
        fs.writeFileSync(file, code, "utf8");
        console.log(`✅ New feature written: ${file}`);

        // --- Auto-test the generated script
        try {
          const output = execFileSync(process.execPath, [file], { encoding: "utf8" });
          console.log("🧪 Test OK");
          logTest(file, true, output, null);
        } catch (e) {
          console.error("❌ Test failed");
          logTest(
            file,
            false,
            (e.stdout || "").toString(),
            (e.stderr || e.message || "").toString()
          );
        }
      } catch (e) {
        console.error("⚠️ Error parsing response:", e.message);
      }
    });
  }
);

req.on("error", (e) => console.error("Request error:", e.message));
req.write(payload);
req.end();
