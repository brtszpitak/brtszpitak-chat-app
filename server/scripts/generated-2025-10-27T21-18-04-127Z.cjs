console.log('Hello! I\'m Alice. You can talk to me.');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.prompt();
rl.on('line', (line) => {
  console.log(`You said: ${line}`);
  // TO DO: integrate NLP library (e.g., NLTK or spaCy) here
  rl.prompt();
}).on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});