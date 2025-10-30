const readline = require('readline');
const { spawn } = require('child_process');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do? ');
rl.prompt();

rl.on('line', (line) => {
  let command;
  if (/^what is/i.test(line)) {
    command = 'powershell Get-ChildItem Env:';
  } else if (/^list files/i.test(line)) {
    command = 'powershell dir';
  } else if (/^create new file/i.test(line)) {
    command = 'powershell New-Item -ItemType File -Path "./newfile.txt"';
  } else {
    console.log('Sorry, I didn\'t understand that.');
    rl.prompt();
    return;
  }
  
  let pwsh = spawn('powershell.exe', ['-Command', command]);
  pwsh.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  pwsh.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  pwsh.on('close', (code) => {
    rl.prompt();
  });
}).on('close', () => {
  process.exit(0);
});