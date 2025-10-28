const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember")) {
    const [key, value] = command.split(" ").slice(1);
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
  } else if (command.startsWith("recall")) {
    const key = command.split(" ")[1];
    console.log(memory[key]);
  }
});
