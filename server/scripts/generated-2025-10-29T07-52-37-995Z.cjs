console.log('Hello! I can understand you want to integrate an NLP module for conversational interactions.')

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  console.log(`AI: I understand you said "${line}"`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});