const readline = require('readline');
const nlp = require('compromise');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Ask me anything > ');
rl.prompt();

rl.on('line', (input) => {
  const doc = nlp(input);
  const intent = doc.terms().out('frequency').data()[0].normal;
  console.log(`You want to ${intent}?`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});