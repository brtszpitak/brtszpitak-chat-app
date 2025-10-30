const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const taggedTokens = tokens.map((token) => ({ token, tag: parser.stem(token) }));
  console.log(taggedTokens);
});

console.log('NLP Module Ready. Type a command or question:');
process.stdin.resume();