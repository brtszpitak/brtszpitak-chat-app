const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(', ')}`);
  
  // Simple intent recognition example:
  if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`Current time is: ${date.toLocaleTimeString()}`);
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});