const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Alice: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // Simple intent detection example
  if (tokens.includes('help') || tokens.includes('assist')) {
    console.log('I can help you with that!');
  } else {
    console.log("I didn't understand. Try rephrasing your request.");
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});