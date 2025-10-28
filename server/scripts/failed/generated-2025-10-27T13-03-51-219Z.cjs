const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lda = new natural.LDA();

let corpus = [];

readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  corpus.push(tokens);
  lda.addDocument(corpus);
  lda.train();
  const topic = lda documento[0].topics[0];
  console.log(`You seem to be talking about ${topic}`);
});