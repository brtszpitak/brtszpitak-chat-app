const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do? ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // basic intent recognition
  if (tokens.includes('what') && tokens.includes('time')) {
    const date = new Date();
    console.log(`It's ${date.toLocaleTimeString()}.`);
  } else if (tokens.includes('help')) {
    console.log('I can assist you with various tasks. Ask me anything!');
  } else {
    console.log('Sorry, I didn\'t understand that.');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});