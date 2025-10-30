const readline = require('readline');
const { spawn } = require('child_process');

let powershell;

process.stdin.setEncoding('utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You: '
});

rl.prompt();

rl.on('line', (line) => {
  if (!powershell) {
    powershell = spawn('powershell.exe');
  }
  powershell.stdin.write(`${line}\n`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});