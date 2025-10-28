const fs = require("fs");
let contextMemory = {};

try {
  contextMemory = JSON.parse(fs.readFileSync("contextMemory.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith(":remember ")) {
    const [_, key, value] = command.split(" ");
    contextMemory[key] = value;
    fs.writeFileSync("contextMemory.json", JSON.stringify(contextMemory));
    console.log(`Remembered ${key} as ${value}`);
  } else if (command.startsWith(":recall ")) {
    const [_, key] = command.split(" ");
    console.log(contextMemory[key]);
  } else {
    console.log("Unknown command. Use :remember <key> <value> or :recall <key>");
  }
});
