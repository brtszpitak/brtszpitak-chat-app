const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

console.log('Hello! I\'m listening...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // Very basic understanding, just to demonstrate the idea
  if (tokens.includes('hello')) {
    console.log('Hello!');
  } else if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`It's ${date.toLocaleTimeString()}.`);
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});