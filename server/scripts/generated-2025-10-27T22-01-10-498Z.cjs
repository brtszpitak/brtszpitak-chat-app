const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Natural Language Interface activated. Type a command or ask a question:");

rl.prompt();

rl.on('line', (input) => {
  const tokens = tokenizer.tokenize(input);
  const taggedTokens = lexer.addTokens(tokens);

  console.log(`You said: ${input}`);
  console.log(`Tokenized input: ${JSON.stringify(taggedTokens, null, 2)}`);

  // TO DO: implement actual NLP logic and actions based on user input

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});