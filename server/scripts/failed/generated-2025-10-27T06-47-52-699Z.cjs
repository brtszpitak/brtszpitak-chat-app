const fs = require("fs");
let memory = {};

try {
  const storedMemory = fs.readFileSync("./alice-memory.json", "utf8");
  memory = JSON.parse(storedMemory);
} catch (err) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const command = input.trim();

  if (command.startsWith("remember ")) {
    const [_, key, value] = command.split(" ");
    memory[key] = value;
    fs.writeFileSync("./alice-memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith("recall ")) {
    const [_, key] = command.split(" ");
    console.log(`Recalled: ${memory[key]}`);
  } else {
    console.log("Unknown command");
  }
});

process.stdin.on("end", () => {
  process.exit();
});
