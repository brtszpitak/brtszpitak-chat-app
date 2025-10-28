const fs = require("fs");
const path = require("path");

let configPath = path.join(process.env.USERPROFILE, ".customCommands.json");

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, "{}");
}

let customCommands = JSON.parse(fs.readFileSync(configPath));

process.stdout.write("Enter command set name: ");
process.stdin.once("data", (name) => {
  name = name.toString().trim();
  process.stdout.write(`Enter commands for ${name} (one per line, Ctrl+C to finish):\n`);
  let commands = [];
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (line) => {
    if (line.toString().trim() !== "") {
      commands.push(line.toString().trim());
    }
  });
  process.stdin.on("SIGINT", () => {
    customCommands[name] = commands;
    fs.writeFileSync(configPath, JSON.stringify(customCommands, null, 2));
    console.log(`Command set ${name} saved.`);
    process.exit();
  });
});
