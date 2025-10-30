const fs = require('fs');
const path = require('path');

let commandSets = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'command_sets.json'), 'utf8');
  commandSets = JSON.parse(data);
} catch (err) {}

function saveCommandSet(name, commands) {
  commandSets[name] = commands;
  fs.writeFileSync(path.join(__dirname, 'command_sets.json'), JSON.stringify(commandSets));
}

function recallCommandSet(name) {
  if (!commandSets[name]) return console.error(`Command set "${name}" not found.`);
  return commandSets[name];
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [cmd, ...args] = input.trim().split(/\s+/);
  switch (cmd) {
    case 'save':
      saveCommandSet(args[0], args.slice(1));
      break;
    case 'recall':
      console.log(recallCommandSet(args[0]));
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
  }
});

console.log('Type "save <name> <command1> <command2> ..." to save a command set, or "recall <name>" to execute a saved command set.');