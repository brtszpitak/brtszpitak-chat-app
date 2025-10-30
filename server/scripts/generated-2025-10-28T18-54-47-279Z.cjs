const nlp = require('compromise');
console.log("Loaded NLP module. Ready to parse natural language input.");

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const doc = nlp(input.toString().trim());
  console.log(`You said: ${doc.text()}`);
  console.log(`Parsed output:`);
  console.log(doc.out('json'));
});