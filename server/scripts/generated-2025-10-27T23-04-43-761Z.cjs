const readline = require('readline');
const nlp = require('compromise');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const doc = nlp(line);
  if (doc.verbs().length > 0) {
    console.log(`Detected command: ${doc.verbs().text()}`);
  } else if (doc.questions().length > 0) {
    console.log(`Detected question: ${doc.questions().text()}`);
  } else {
    console.log('Unknown input');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});