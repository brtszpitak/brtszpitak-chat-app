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
    const question = command.replace('what is ', '');
    console.log(`The answer to "${question}" is... (TO DO: implement NLP response)`);
  } else if (command.startsWith('run ')) {
    const cmd = command.replace('run ', '');
    console.log(`Running Windows command: ${cmd}`);
    // TO DO: implement Windows command execution
  } else {
    console.log(`Unknown command: ${command}`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});