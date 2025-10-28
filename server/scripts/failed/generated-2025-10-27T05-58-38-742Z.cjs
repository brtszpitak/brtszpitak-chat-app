const fs = require("fs");
const path = require("path");

let memory = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "memory.json"), "utf8");
  memory = JSON.parse(data);
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdout.write("Hello! I'm remembering...\n");

process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const [_, key, value] = command.split(" ");
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
    process.stdout.write(`Remembered: ${key} = ${value}\n`);
  } else if (command.startsWith("recall ")) {
    const [_, key] = command.split(" ");
    const value = memory[key];
    process.stdout.write(`${key} = ${value || "(not found)"}\n`);
  }
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!\n");
});
