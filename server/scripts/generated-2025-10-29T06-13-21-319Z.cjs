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
  
  const intent = lexer.classify(tokens).best;
  console.log(`Intent: ${intent.label} (${intent.value})`);
  
  switch (intent.label) {
    case 'ask':
      console.log('You asked a question!');
      break;
    case 'command':
      console.log('You gave a command!');
      break;
    default:
      console.log('Unknown intent.');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});