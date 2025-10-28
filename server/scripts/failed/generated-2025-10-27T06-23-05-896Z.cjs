global.memory = global.memory || {};

const fs = require("fs");
const path = require("path");

const memoryFile = path.join(process.cwd(), "memory.json");

try {
  global.memory = JSON.parse(fs.readFileSync(memoryFile));
} catch (e) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (data) => {
  const input = data.trim();
  if (input.startsWith("remember ")) {
    const [_, key, value] = input.split(" ");
    global.memory[key] = value;
    fs.writeFileSync(memoryFile, JSON.stringify(global.memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (input.startsWith("recall ")) {
    const [_, key] = input.split(" ");
    console.log(`Recalled: ${global.memory[key]}`);
  }
});

process.stdin.on("end", () => {
  process.exit();
});
