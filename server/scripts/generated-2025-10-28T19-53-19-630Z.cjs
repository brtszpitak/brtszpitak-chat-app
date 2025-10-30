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
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokenized input: ${tokens.join(', ')}`);
  
  // Simple intent identification using token analysis
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log('You asked for the time!');
  } else if (tokens.includes('help')) {
    console.log('I can assist you with various tasks. What do you need help with?');
  } else {
    console.log('Sorry, I didn\'t understand that.');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});