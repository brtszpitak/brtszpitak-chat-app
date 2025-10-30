const NLP = require('compromise');

console.log('Hello! I can understand natural language now.');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = NLP(input.trim());
  console.log(`You said: ${doc.text()}`);
  
  if (doc.has('#Question')) {
    console.log('I see you have a question!');
  } else if (doc.has('#Command')) {
    console.log('I can help you with that command!');
  }
  
  process.stdout.write('> ');
});