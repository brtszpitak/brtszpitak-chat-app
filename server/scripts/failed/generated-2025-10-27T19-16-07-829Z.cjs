const fs = require("fs");
const path = require("path");

let commandHistory = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "command_history.json"), "utf8");
  commandHistory = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (!commandHistory[command]) commandHistory[command] = 0;
  commandHistory[command]++;
  fs.writeFileSync(path.join(__dirname, "command_history.json"), JSON.stringify(commandHistory));
});

process.stdin.on("end", () => {
  console.log("Command history:");
  Object.keys(commandHistory)
    .sort((a, b) => commandHistory[b] - commandHistory[a])
    .slice(0, 5)
    .forEach((cmd) => console.log(`  ${cmd}`));
});
