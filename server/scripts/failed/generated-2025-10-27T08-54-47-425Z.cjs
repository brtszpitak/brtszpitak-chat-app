const fs = require("fs");
const path = require("path");

let memory = {};

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
}

function loadMemory() {
  try {
    memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json")).toString());
  } catch (e) {}
}

loadMemory();

process.stdin.on("data", (input) => {
  const conversation = input.toString().trim();
  if (!conversation) return;

  const key = crypto.createHash("sha256").update(conversation).digest("hex");
  memory[key] = { conversation, timestamp: Date.now() };
  saveMemory();

  console.log(`Stored conversation ${key}`);
});

process.stdin.setEncoding("utf8");
