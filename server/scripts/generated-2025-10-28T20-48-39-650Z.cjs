const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const taggedTokens = lexer.addTokens(tokens);
  
  console.log(taggedTokens);
});

console.log('Type a sentence to analyze:');
process.stdin.resume();