const Nlp = require('compromise');

function processInput(input) {
  const doc = Nlp(input);
  console.log(`You said: ${input}`);
  console.log(`Tags: ${doc.tags().length > 0 ? doc.tags().map(tag => tag.text()).join(', ') : 'None'}`);
  console.log(`Entities: ${doc.entities().length > 0 ? doc.entities().map(entity => entity.text()).join(', ') : 'None'}`);
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  processInput(input.trim());
});

console.log('Type something to interact with me...');