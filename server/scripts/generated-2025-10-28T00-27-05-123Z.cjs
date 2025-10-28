const NLP = require('compromise');

const nlp = NLP();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = nlp(input.toString().trim());
  console.log(doc.out('text'));
});