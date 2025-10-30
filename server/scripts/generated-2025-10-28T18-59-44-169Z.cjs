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
  console.log(`AI: ${doc.verbs().toList().map(v => v.text).join(', ')}`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});