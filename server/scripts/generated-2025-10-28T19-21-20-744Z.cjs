const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What can I help you with? ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('exit')) {
    rl.close();
  } else {
    console.log(`Processing command: ${command}`);
    const powershell = spawn('powershell.exe', ['-Command', `& { ${command} }`]);
    powershell.stdout.on('data', (data) => {
      console.log(`Output: ${data}`);
    });
    powershell.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });
  }
}).on('close', () => {
  process.exit(0);
});