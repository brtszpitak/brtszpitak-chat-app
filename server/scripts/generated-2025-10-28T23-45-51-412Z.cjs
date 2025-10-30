const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  const stemmedTokens = tokenizedInput.map((token) => parser.stem(token));
  console.log(`You said: ${input}`);
  console.log(`Tokenized input: ${tokenizedInput.join(', ')}`);
  console.log(`Stemmed tokens: ${stemmedTokens.join(', ')}`);
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!\n');
});