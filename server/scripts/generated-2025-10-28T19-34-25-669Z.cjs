const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome! You can now interact with me using everyday language.');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const command = parseCommand(line);
  if (command) {
    executeCommand(command);
  } else {
    console.log('Sorry, I didn\'t understand that. Please try again!');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});

function parseCommand(input) {
  // TO DO: implement NLP logic to parse user input into Windows command
  // For now, let's just echo the input
  return `echo ${input}`;
}

function executeCommand(command) {
  const shell = spawn('powershell.exe', ['-Command', command]);
  shell.stdout.on('data', (data) => {
    console.log(`>${data}`);
  });
  shell.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
}