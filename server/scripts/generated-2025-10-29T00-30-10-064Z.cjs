const readline = require('readline');
const moment = require('moment');

console.log("Hello! I'm here to assist you. You can talk to me in everyday language.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const userInput = line.trim();
  if (userInput !== '') {
    console.log(`You said: ${userInput}`);
    try {
      // Very basic natural language understanding implementation
      if (userInput.toLowerCase().includes('what time is it')) {
        console.log(`Current time is: ${moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')}`);
      } else {
        console.log("I didn't understand that. Please try again!");
      }
    } catch (e) {
      console.error(e);
    }
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});