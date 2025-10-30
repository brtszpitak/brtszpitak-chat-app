const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Hello! I'm here to help. Type your question or request:");

rl.on('line', (input) => {
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // TO DO: implement NLP logic here
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});