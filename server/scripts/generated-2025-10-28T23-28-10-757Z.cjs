console.log("Welcome to the NLP Module!");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`AI: I understand you said "${line}".`);
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});