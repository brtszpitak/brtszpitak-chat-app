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
  console.log(`AI: ${doc.verbs().text() ? `I understand you want to ${doc.verbs().text()}.` : 'I didn\'t quite catch that.'}`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});