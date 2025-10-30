const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(', ')}`);
  
  // Basic intent detection example
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log('Current time is:', new Date().toLocaleTimeString());
  } else if (tokens.includes('hello')) {
    console.log('Hello!');
  } else {
    console.log('I did not understand that. Try again!');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});