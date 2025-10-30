const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! I\'m Alice. How can I assist you today?');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);

  // Simple intent detection
  if (tokens.includes('help')) {
    console.log('I can assist you with various tasks. What would you like to know?');
  } else if (tokens.includes('quit') || tokens.includes('exit')) {
    rl.close();
  } else {
    console.log('I didn\'t understand that. Please try again!');
  }

  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});