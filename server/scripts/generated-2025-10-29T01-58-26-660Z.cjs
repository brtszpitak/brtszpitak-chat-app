const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userInput = line.trim();
  
  // Very basic NLP - just to demonstrate the idea
  if (userInput.startsWith('what is my')) {
    const query = userInput.replace('what is my ', '');
    console.log(`Your ${query} is... (not implemented yet)`);
  } else if (userInput.startsWith('run ')) {
    const command = userInput.replace('run ', '');
    console.log(`You want to run: ${command}`);
    // TO DO: implement running Windows commands using child_process
  } else {
    console.log("I didn't understand that. Try again!");
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});