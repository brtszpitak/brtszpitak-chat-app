const nlp = require('compromise');

console.log('Natural Language Processing Module Ready!');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = nlp(input.trim());
  console.log(doc.out('tags'));
  if (doc.has('#Question')) {
    console.log('You asked a question!');
  } else if (doc.has('#Command')) {
    console.log('You gave a command!');
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});