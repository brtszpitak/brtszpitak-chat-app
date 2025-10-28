const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
}

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
}

function remember(key, value) {
  memory[key] = value;
  saveMemory();
}

function recall(key) {
  return memory[key];
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim().toLowerCase();

  if (command.startsWith("remember")) {
    const [_, key, value] = command.split(" ");
    remember(key, value);
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith("recall")) {
    const [_, key] = command.split(" ");
    const value = recall(key);
    console.log(`Recalled: ${key} = ${value}`);
  }
});

process.stdin.on("end", () => {
  process.stdout.write("\n");
});
