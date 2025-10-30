const fs = require('fs');
const path = require('path');

let commandSets = {};

if (fs.existsSync(path.join(__dirname, 'command_sets.json'))) {
  commandSets = JSON.parse(fs.readFileSync(path.join(__dirname, 'command_sets.json'), 'utf8'));
}

process.stdin.setEncoding('utf8');

console.log('Command Set Manager');
console.log('------------------');
console.log('1. Create new command set');
console.log('2. List all command sets');
console.log('3. Execute a command set');
console.log('4. Exit');

process.stdin.on('data', (input) => {
  const choice = parseInt(input.trim());

  switch (choice) {
    case 1:
      createCommandSet();
      break;
    case 2:
      listCommandSets();
      break;
    case 3:
      executeCommandSet();
      break;
    case 4:
      process.exit(0);
      break;
    default:
      console.log('Invalid choice. Please try again.');
  }
});

function createCommandSet() {
  console.log('Enter a name for the new command set:');
  process.stdin.once('data', (name) => {
    const setName = name.trim();
    console.log(`Enter commands for ${setName} (one per line, Ctrl+D to finish):`);
    let commands = '';
    process.stdin.on('data', (chunk) => {
      commands += chunk;
    });
    process.stdin.once('end', () => {
      commandSets[setName] = commands.trim().split('\n');
      fs.writeFileSync(path.join(__dirname, 'command_sets.json'), JSON.stringify(commandSets));
      console.log(`Command set ${setName} created successfully.`);
    });
  });
}

function listCommandSets() {
  console.log('Available command sets:');
  for (const setName in commandSets) {
    console.log(`- ${setName}`);
  }
}

function executeCommandSet() {
  console.log('Enter the name of the command set to execute:');
  process.stdin.once('data', (name) => {
    const setName = name.trim();
    if (commandSets[setName]) {
      for (const command of commandSets[setName]) {
        console.log(`Executing: ${command}`);
        require('child_process').execSync(command, { stdio: 'inherit' });
      }
    } else {
      console.log(`Command set ${setName} does not exist.`);
    }
  });
}