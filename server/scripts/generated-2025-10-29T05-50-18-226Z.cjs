console.log('Alice NLP Prototype');

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
  console.log(`Tokenized input: ${tokens.join(', ')}`);
  
  // Simple intent detection example
  if (tokens.includes('hello')) {
    console.log('Alice: Hello!');
  } else if (tokens.includes('help')) {
    console.log('Alice: I can assist you with natural language processing tasks.');
  } else {
    console.log('Alice: Sorry, I didn\'t understand that. Please try again!');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});