fs = require("fs");

let commandSets = {};

if (process.argv[2] === "save") {
  let setName = process.argv[3];
  let commands = process.argv.slice(4);
  commandSets[setName] = commands;
  fs.writeFileSync("commandSets.json", JSON.stringify(commandSets, null, 2));
} else if (process.argv[2] === "load") {
  let setName = process.argv[3];
  if (fs.existsSync("commandSets.json")) {
    commandSets = JSON.parse(fs.readFileSync("commandSets.json", "utf8"));
    if (commandSets[setName]) {
      console.log(commandSets[setName].join("\n"));
    } else {
      console.error(`Command set '${setName}' not found.`);
    }
  } else {
    console.error("No command sets saved.");
  }
}
