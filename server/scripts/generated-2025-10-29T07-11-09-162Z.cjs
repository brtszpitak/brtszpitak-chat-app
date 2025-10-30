const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

let powershell;

rl.on('line', (line) => {
  if (!powershell) {
    powershell = spawn('powershell.exe');
  }
  
  const command = `& { ${nlpToPowershell(line)} }`;
  powershell.stdin.write(`${command}\n`);
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});

function nlpToPowershell(input) {
  // TO DO: implement NLP logic to convert user input to PowerShell command
  return input; // placeholder, returns original input for now
}