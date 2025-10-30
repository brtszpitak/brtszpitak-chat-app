const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Ask me anything > ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('exit')) {
    rl.close();
  } else {
    try {
      const powershell = spawn('powershell.exe', ['-Command', command]);
      powershell.stdout.on('data', (data) => {
        console.log(`Powershell output: ${data}`);
      });
      powershell.stderr.on('data', (data) => {
        console.error(`Powershell error: ${data}`);
      });
    } catch (error) {
      console.error(`Error executing command: ${error}`);
    }
  }
  rl.prompt();
});