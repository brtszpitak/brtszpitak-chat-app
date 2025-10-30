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
  console.log(`Tokenized input: ${tokens.join(', ')}`);
  
  // Simple intent recognition example
  if (tokens.includes('hello') || tokens.includes('hi')) {
    console.log('Hello! How can I assist you today?');
  } else if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}.`);
  } else {
    console.log('I did not understand your input. Please try again!');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});