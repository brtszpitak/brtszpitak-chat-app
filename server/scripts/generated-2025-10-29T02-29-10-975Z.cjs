const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const taggedTokens = lexer.addTokens(tokens);

  console.log(`Tagged Tokens:`);
  taggedTokens.forEach((token, index) => {
    console.log(`${index}: ${token.token} (${token.tag})`);
  });

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});