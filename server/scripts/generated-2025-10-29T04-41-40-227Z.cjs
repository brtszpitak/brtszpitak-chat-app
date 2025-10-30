console.log("Hello! I'm ready to chat.");

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userInput = line.trim();
  
  if (userInput === 'quit') {
    rl.close();
  } else {
    console.log(`AI: I'm not sure what you mean by "${userInput}".`);
    rl.setPrompt('You: ');
    rl.prompt();
  }
}).on('close', () => {
  process.exit(0);
});