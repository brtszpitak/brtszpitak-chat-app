const readline = require('readline');
const nlp = require('compromise');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! I\'m here to help. Ask me anything or give a command.');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const doc = nlp(line);
  if (doc.has('#Question')) {
    console.log('You asked: ' + line);
  } else if (doc.has('#Verb')) {
    console.log('You gave a command: ' + line);
  } else {
    console.log('I didn\'t understand. Please rephrase.');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});