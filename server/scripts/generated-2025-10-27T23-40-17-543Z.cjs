const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();

rl.question('How can I assist you? ', (question) => {
  const tokens = tokenizer.tokenize(question);
  console.log(`You asked: ${tokens.join(' ')}`);
  rl.close();
});