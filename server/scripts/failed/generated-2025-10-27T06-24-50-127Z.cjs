console.log("Initializing context-aware memory feature...");

const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const keyValuePair = command.substring(9).split("=");
    memory[keyValuePair[0].trim()] = keyValuePair[1].trim();
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
    console.log(`Remembered: ${keyValuePair[0]} = ${keyValuePair[1]}`);
  } else if (command.startsWith("recall ")) {
    const key = command.substring(7).trim();
    if (memory.hasOwnProperty(key)) {
      console.log(`Recalled: ${key} = ${memory[key]}`);
    } else {
      console.log(`No memory found for '${key}'`);
    }
  } else {
    console.log(
      'Unknown command. Use "remember <key>=<value>" to store or "recall <key>" to retrieve information.'
    );
  }
});
