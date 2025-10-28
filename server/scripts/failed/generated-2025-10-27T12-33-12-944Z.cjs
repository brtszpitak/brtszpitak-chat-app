const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const command = input.trim();

  if (command.startsWith(":remember ")) {
    const [key, value] = command.slice(9).trim().split(" ", 2);
    memory[key] = value;
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith(":recall ")) {
    const key = command.slice(8).trim();
    console.log(memory[key]);
  } else {
    console.log("Unknown command");
  }
});

process.stdin.on("end", () => process.exit());
