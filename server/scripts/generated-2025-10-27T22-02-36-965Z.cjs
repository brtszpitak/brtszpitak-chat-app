const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

console.log('NLP Module: Ask me anything...');

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);

  if (input.startsWith('what is')) {
    console.log(`You asked about ${tokens.slice(2).join(' ')}`);
  } else if (input.startsWith('do')) {
    console.log(`I will try to ${tokens.slice(1).join(' ')}`);
  } else {
    console.log(`Sorry, I didn't understand "${input}"`);
  }
});