console.log("Context-Aware Memory System");

const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  try {
    memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
  } catch (e) {}
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userQuery = input.trim();
  if (userQuery.startsWith("remember ")) {
    const [_, key, value] = userQuery.split(" ");
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory, null, 2));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (userQuery.startsWith("recall ")) {
    const [_, key] = userQuery.split(" ");
    console.log(`Recalled: ${key} = ${memory[key] || "Unknown"}`);
  }
});
