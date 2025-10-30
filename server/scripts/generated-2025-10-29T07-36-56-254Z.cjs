const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const PorterStemmer = natural.PorterStemmer;
const stemmer = new PorterStemmer();

console.log('Welcome! I\'m listening...');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  const stemmedTokens = tokens.map((token) => stemmer.stem(token));
  console.log(`You said: ${stemmedTokens.join(' ')}`);
});
process.stdin.on('end', () => process.exit());