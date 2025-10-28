const fs = require("fs");
let contextMemory = {};

try {
  contextMemory = JSON.parse(fs.readFileSync("context_memory.json", "utf8"));
} catch (e) {}

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input.startsWith("remember ")) {
    const [key, value] = input.slice(9).split("=");
    contextMemory[key.trim()] = value.trim();
    fs.writeFileSync("context_memory.json", JSON.stringify(contextMemory, null, 2));
  } else if (input.startsWith("recall ")) {
    const key = input.slice(7).trim();
    console.log(contextMemory[key]);
  }
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
