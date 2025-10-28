const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.trim();
  if (input.startsWith("remember ")) {
    const [key, value] = input.substring(8).trim().split(": ");
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (input.startsWith("recall ")) {
    const key = input.substring(7).trim();
    console.log(memory[key]);
  }
});
