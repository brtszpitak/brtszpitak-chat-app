const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  try {
    console.log(`AI: ${parseCommand(line.trim())}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});

function parseCommand(command) {
  const commandMap = {
    'what is the time': 'Get-Date',
    'list files': 'Get-ChildItem',
    // Add more commands here
  };

  if (command in commandMap) {
    return `You can use PowerShell command: ${commandMap[command]}`;
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
}