const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  
  if (tokens.includes('run') && tokens.includes('command')) {
    const command = tokens.slice(tokens.indexOf('run') + 1, tokens.indexOf('command')).join(' ');
    console.log(`PowerShell: ${command}`);
    // Add logic to execute the PowerShell command here
  } else if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`Current time is: ${date.toLocaleTimeString()}`);
  } else {
    console.log('I did not understand that. Please try again.');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});