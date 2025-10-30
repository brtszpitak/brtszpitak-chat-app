const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (text) => {
  const tokens = tokenizer.tokenize(text.toString().trim());
  console.log(`You said: ${tokens.join(' ')}`);
});

console.log('Type something, and I\'ll repeat it back to you!');