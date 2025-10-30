const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (input) => {
  const tokens = tokenizer.tokenize(input);
  console.log(`Tokenized input: ${tokens.join(', ')}`);

  // Simple intent recognition example
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log('Current time:', new Date().toLocaleTimeString());
  } else if (tokens.includes('help')) {
    console.log('Available commands: ...');
  } else {
    console.log('Unknown command or question. Please try again!');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});