console.log('Hello from Alice!');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userInput = line.trim();
  if (userInput !== '') {
    console.log(`Alice: I'm not sure what you mean by "${userInput}". Can you please rephrase or ask something else?`);
    rl.prompt();
  }
}).on('close', () => {
  process.exit(0);
});