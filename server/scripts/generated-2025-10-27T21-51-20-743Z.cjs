const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`AI: Hello! You said "${line}". I'm not yet capable of understanding natural language, but I'll work on it!`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});