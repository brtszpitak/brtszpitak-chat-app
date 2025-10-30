const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what is')) {
    const query = command.replace('what is ', '');
    spawn('start', ['https://www.google.com/search?q=' + encodeURIComponent(query)]);
  } else if (command.startsWith('run ')) {
    const cmd = command.replace('run ', '');
    spawn('powershell.exe', ['-Command', cmd]);
  } else {
    console.log(`I didn't understand: ${command}`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});