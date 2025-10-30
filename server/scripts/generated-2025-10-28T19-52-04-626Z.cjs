const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(', ')}`);

  // Simple intent detection
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log('Current time:', new Date().toLocaleTimeString());
  } else if (tokens.includes('hello')) {
    console.log('Hello!');
  } else {
    console.log('I did not understand that.');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});