const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You > ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what is ')) {
    const query = command.replace('what is ', '');
    console.log(`Searching for ${query}...`);
    // TO DO: implement NLP logic to process the query
    rl.prompt();
  } else if (command.startsWith('run ')) {
    const psCommand = command.replace('run ', '');
    console.log(`Running PowerShell command: ${psCommand}`);
    // TO DO: implement PowerShell command execution
    rl.prompt();
  } else {
    console.log('Unknown command. Try again!');
    rl.prompt();
  }
}).on('close', () => {
  process.exit(0);
});