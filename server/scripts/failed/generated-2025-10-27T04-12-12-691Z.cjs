const fs = require("fs");
const path = require("path");

let memory = {};

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
}

function loadMemory() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "memory.json"));
    memory = JSON.parse(data);
  } catch (e) {}
}

loadMemory();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const [_, key, value] = command.split(" ");
    memory[key] = value;
    saveMemory();
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command === "forget") {
    memory = {};
    saveMemory();
    console.log("Memory cleared");
  } else if (command.startsWith("recall ")) {
    const [_, key] = command.split(" ");
    console.log(memory[key]);
  }
});
