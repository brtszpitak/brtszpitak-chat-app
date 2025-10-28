const fs = require("fs");
const path = require("path");

let commandsDB = {};

try {
  const dbPath = path.join(__dirname, "commands.json");
  commandsDB = JSON.parse(fs.readFileSync(dbPath, "utf8"));
} catch (e) {}

function saveCommandSet(name, commands) {
  commandsDB[name] = commands;
  fs.writeFileSync(path.join(__dirname, "commands.json"), JSON.stringify(commandsDB));
}

function executeCommandSet(name) {
  if (!commandsDB[name]) return console.error(`Command set '${name}' not found.`);
  const commands = commandsDB[name];
  for (const command of commands) {
    require("child_process").execSync(command, { stdio: "inherit" });
  }
}

if (process.argv[2] === "--save") {
  saveCommandSet(process.argv[3], process.argv.slice(4));
} else if (process.argv[2] === "--execute") {
  executeCommandSet(process.argv[3]);
} else {
  console.error("Usage: node script.cjs --save <name> <commands...>");
  console.error("   or: node script.cjs --execute <name>");
}
