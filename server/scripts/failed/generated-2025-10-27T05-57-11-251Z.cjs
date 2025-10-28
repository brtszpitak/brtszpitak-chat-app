const fs = require("fs");
const path = require("path");

let memory = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "memory.json"), "utf8");
  memory = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const [key, value] = command.substring(9).trim().split("=");
    memory[key.trim()] = value.trim();
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
  } else if (command === "recall") {
    console.log(memory);
  }
});

process.stdin.on("end", () => process.exit());
