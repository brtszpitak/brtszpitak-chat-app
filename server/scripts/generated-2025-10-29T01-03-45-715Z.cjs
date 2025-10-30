const readline = require('readline');
const { spawn } = require('child_process');

let powershell;

readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', (input) => {
  if (!powershell) {
    powershell = spawn('powershell.exe');
  }
  const command = `/${input}/`;
  powershell.stdin.write(command + '\n');
}).on('close', () => {
  process.exit(0);
});