console.log("Context-Aware Memory System");

const fs = require("fs");
const path = require("path");

let memory = {};

if (fs.existsSync(path.join(__dirname, "memory.json"))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, "memory.json"), "utf8"));
}

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
}

function recall(key) {
  return memory[key];
}

console.log('Memory initialized. You can use "remember" and "recall" functions.');

// Example usage:
remember("user-preference", "dark-mode");
console.log(recall("user-preference")); // Output: dark-mode
