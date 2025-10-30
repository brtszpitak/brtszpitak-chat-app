console.log("Integrating NLP module is a great idea! However, this script doesn't do that yet.");

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do on your Windows PC? ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`You said: ${line}`);
  // TO DO: Implement NLP module integration here
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});