const readline = require('readline');
const { spawn } = require('child_process');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
    try {
      let command = parseCommand(line);
      executeCommand(command);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});

function parseCommand(input) {
  // Basic NLP implementation, can be improved with a dedicated library
  let command = '';
  if (input.startsWith('what is ') || input.startsWith('what are ')) {
    command = 'powershell.exe Get-ChildItem | Where-Object {$_.Name -like \'*\' + input.substring(7) + \'*\'}';
  } else if (input.startsWith('run ') || input.startsWith('execute ')) {
    command = input.substring(4);
  } else if (input.startsWith('list ') || input.startsWith('show me ')) {
    command = 'powershell.exe Get-ChildItem -Name ' + input.substring(5);
  } else {
    throw new Error(`Unsupported command: ${input}`);
  }
  return command;
}

function executeCommand(command) {
  let process = spawn(command, [], { shell: true });
  process.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
}