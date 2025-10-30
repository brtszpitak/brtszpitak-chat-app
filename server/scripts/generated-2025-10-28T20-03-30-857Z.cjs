const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`AI: I'm not sure what you mean by "${line}". Can you please rephrase or provide more context?`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});