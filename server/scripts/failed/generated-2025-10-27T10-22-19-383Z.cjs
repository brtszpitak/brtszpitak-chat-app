console.log("Initializing context-aware knowledge graph...");
const fs = require("fs");
const path = require("path");

let memory = {};

function remember(key, value) {
  if (!memory[key]) memory[key] = [];
  memory[key].push(value);
}

function recall(key) {
  return memory[key];
}

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory, null, 2));
}

function loadMemory() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "memory.json"));
    Object.assign(memory, JSON.parse(data));
  } catch (e) {}
}

loadMemory();

console.log("Ready to chat!");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const message = input.trim();
  if (message.startsWith("remember ")) {
    const [_, key, value] = message.split(" ");
    remember(key, value);
    console.log(`Remembered ${key} = ${value}`);
  } else if (message.startsWith("recall ")) {
    const [_, key] = message.split(" ");
    const values = recall(key);
    console.log(`Recalled ${key} = ${values.join(", ")}`);
  }
  saveMemory();
});

process.stdin.on("end", () => process.exit());
