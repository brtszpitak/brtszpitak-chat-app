const nlp = require('compromise');

console.log('NLP Module Loaded. Type a sentence to analyze:');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = nlp(input.trim());
  console.log(doc.out('text'));
  console.log(`Part-of-speech tags: ${doc.tags().join(', ')}`);
  console.log(`Named Entities: ${doc.entities().json().map(e => e.text).join(', ')}`);
  process.exit();
});