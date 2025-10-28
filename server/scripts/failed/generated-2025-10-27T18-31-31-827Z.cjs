const fs = require("fs");
const path = require("path");

let configPath = path.join(process.cwd(), "customCommands.json");

try {
  let customCommands = fs.readFileSync(configPath, "utf8");
  customCommands = JSON.parse(customCommands);
} catch (err) {
  let customCommands = {};
}

function saveCommandSet(name, commands) {
  customCommands[name] = commands;
  fs.writeFileSync(configPath, JSON.stringify(customCommands, null, 2));
}

function recallCommandSet(name) {
  if (customCommands.hasOwnProperty(name)) {
    return customCommands[name];
  } else {
    console.log(`Command set "${name}" not found.`);
    return [];
  }
}

console.log("Custom Command Sets:");
Object.keys(customCommands).forEach((key) => console.log(`- ${key}`));

let action = process.argv[2];

if (action === "save") {
  let name = process.argv[3];
  let commands = process.argv.slice(4);
  saveCommandSet(name, commands);
} else if (action === "recall") {
  let name = process.argv[3];
  let commands = recallCommandSet(name);
  console.log(commands.join("\n"));
}
