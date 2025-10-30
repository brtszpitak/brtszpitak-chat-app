const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do? ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim().toLowerCase();
  
  if (command.startsWith('what is')) {
    const query = command.replace('what is ', '');
    spawn('powershell.exe', ['/c', `Start-Process https://www.google.com/search?q=${query}`]);
  } else if (command.startsWith('list files')) {
    spawn('powershell.exe', ['/c', 'Get-ChildItem']);
  } else {
    console.log(`I didn't understand that. Try asking a question or giving a command.`);
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});