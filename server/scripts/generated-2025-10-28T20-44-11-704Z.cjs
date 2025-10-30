console.log('Hello! I\'m ready to chat.');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userInput = line.trim();
  
  if (userInput.startsWith('what is your name')) {
    console.log('I\'m Alice, nice to meet you!');
  } else if (userInput.startsWith('hello') || userInput.startsWith('hi')) {
    console.log('Hello! How can I assist you today?');
  } else {
    console.log(`Sorry, I didn't understand "${userInput}".`);
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});