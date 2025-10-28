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
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "remember":
      if (args.length < 2) break;
      const key = args.shift();
      memory[key] = args.join(" ");
      saveMemory();
      console.log(`Remembered: ${key} => ${memory[key]}`);
      break;

    case "recall":
      if (!args.length) break;
      const value = memory[args[0]];
      console.log(value ? `Recalled: ${value}` : `Unknown: ${args[0]}`);
      break;

    default:
      console.log("Unknown command");
  }
});

process.stdin.on("end", () => process.exit(0));
