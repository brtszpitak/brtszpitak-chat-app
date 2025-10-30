const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome! You can interact with me using everyday conversational language.");

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});