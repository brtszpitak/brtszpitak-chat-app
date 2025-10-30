const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`You said: ${line}`);
  // TO DO: implement natural language understanding module here
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});