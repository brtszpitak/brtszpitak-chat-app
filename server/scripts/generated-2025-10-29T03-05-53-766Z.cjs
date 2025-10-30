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
  console.log(`Tokens: ${tokens.join(', ')}`);
  
  lexer.addDocument(tokens, 'user');
  const classification = lexer.classify('user');
  console.log(`Classification: ${classification}`);

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});