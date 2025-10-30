const NLP = require('compromise');
let nlp = NLP();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  let doc = nlp.text(input.toString().trim());
  console.log(doc.out('tags'));
  process.stdout.write('> ');
}); 

process.stdout.write('> ');