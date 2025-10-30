const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Natural Language Understanding Module');
console.log('Type "exit" to quit.');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
    try {
      const command = interpretCommand(line);
      executeCommand(command);
      console.log(`Executed: ${command}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});

function interpretCommand(input) {
  const commands = {
    'what is the date': 'Get-Date',
    'list files': 'dir',
    'create new file': 'New-Item -ItemType File -Name "newfile.txt"',
    // Add more commands here
  };

  for (const phrase in commands) {
    if (input.toLowerCase().includes(phrase)) {
      return commands[phrase];
    }
  }

  throw new Error(`Unknown command: ${input}`);
}

function executeCommand(command) {
  const powershell = spawn('powershell.exe', ['-Command', command]);
  powershell.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  powershell.stderr.on('data', (data) => {
    console.error(`${data}`);
  });
}