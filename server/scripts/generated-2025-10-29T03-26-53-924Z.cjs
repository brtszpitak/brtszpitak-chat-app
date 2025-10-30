const readline = require('readline');
const nlp = require('compromise');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! I\'m listening...');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const doc = nlp(line);
  console.log(`You said: ${doc.text()}`);
  if (doc.has('verb')) {
    console.log(`You want to ${doc.verbs().text()}`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});