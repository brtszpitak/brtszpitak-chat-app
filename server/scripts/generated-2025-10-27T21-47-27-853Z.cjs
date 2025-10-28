const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);

  // Simple intent recognition example
  if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}`);
  } else if (tokens.includes('help')) {
    console.log('I can assist you with various tasks. What would you like to do?');
  } else {
    console.log('Sorry, I didn\'t understand that. Please try again!');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});