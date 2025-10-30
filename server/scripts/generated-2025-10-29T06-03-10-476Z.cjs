const nlp = require('compromise');

console.log("NLP Module Loaded. You can ask me anything!");

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = nlp(input.trim());
  console.log(doc.out('text'));
});