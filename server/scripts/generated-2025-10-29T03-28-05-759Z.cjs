const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Hello! I'm Alice. You can talk to me in everyday conversational language.");

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // very basic intent detection
  if (tokens.includes('help')) {
    console.log("I can assist you with various tasks. What do you need help with?");
  } else if (tokens.includes('quit') || tokens.includes('exit')) {
    rl.close();
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});