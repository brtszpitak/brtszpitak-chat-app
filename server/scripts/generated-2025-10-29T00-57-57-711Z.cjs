const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${input}`);
  console.log(`Tokens: ${tokens.join(', ')}`);
});

console.log('Type something, and I\'ll tokenize it!');