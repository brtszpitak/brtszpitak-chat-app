console.log('Natural Language Understanding Module - Prototype');

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

rl.on('line', (input) => {
  const tokens = tokenizer.tokenize(input);
  console.log(`Tokens: ${tokens.join(', ')}`);

  const sentence = lexer.addSentence(tokens);
  console.log(`Tagged Sentence: ${sentence}`);

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});