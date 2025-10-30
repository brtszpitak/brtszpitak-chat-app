console.log('Hello! I\'m Alice. Please talk to me in everyday conversational language.');

const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(line);

  console.log(`You said: ${tokens.join(', ')}`);

  // Very basic intent detection, just for demonstration purposes
  if (tokens.includes('hello') || tokens.includes('hi')) {
    console.log('Hello! How can I help you today?');
  } else {
    console.log('I didn\'t understand that. Please try again!');
  }

  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});