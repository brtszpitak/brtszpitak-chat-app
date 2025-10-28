const fs = require("fs");
const path = require("path");

let db = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "commands.json"), "utf8");
  db = JSON.parse(data);
} catch (err) {}

function saveCommandSet(name, commands) {
  db[name] = commands;
  fs.writeFileSync(path.join(__dirname, "commands.json"), JSON.stringify(db, null, 2));
}

function executeCommandSet(name) {
  if (!db.hasOwnProperty(name)) return console.error(`Command set "${name}" not found.`);
  const commands = db[name];
  for (const command of commands) require("child_process").execSync(command);
}

saveCommandSet("myCommands", ["echo Hello World!", "node --version"]);
executeCommandSet("myCommands");
