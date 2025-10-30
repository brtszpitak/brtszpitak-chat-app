const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // Simple intent recognition example
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log('Current time is:', new Date().toLocaleTimeString());
  } else if (tokens.includes('help')) {
    console.log('Available commands: ...');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});