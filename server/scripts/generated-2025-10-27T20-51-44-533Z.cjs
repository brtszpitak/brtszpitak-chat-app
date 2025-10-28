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
  const command = tokens.find(token => ['what', 'how', 'do'].includes(token.toLowerCase()));
  
  if (command) {
    switch (tokens[tokens.indexOf(command) + 1].toLowerCase()) {
      case 'is':
        console.log('You asked what is...');
        break;
      case 'to':
        console.log('You asked how to...');
        break;
      default:
        console.log('Unknown command');
    }
  } else {
    console.log('Unknown command');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});