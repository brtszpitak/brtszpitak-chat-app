const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry('hello', 'GREETING');
lexicon.addEntry('hi', 'GREETING');
lexicon.addEntry('what\'s up', 'GREETING');
lexicon.addEntry('how are you', 'QUESTION');
lexicon.addEntry('goodbye', 'FAREWELL');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  let intent = null;
  for (let token of tokens) {
    const entry = lexicon.lookup(token);
    if (entry) {
      intent = entry.category;
      break;
    }
  }

  switch (intent) {
    case 'GREETING':
      console.log('Hello!');
      break;
    case 'QUESTION':
      console.log('I\'m doing great, thanks!');
      break;
    case 'FAREWELL':
      console.log('Goodbye!');
      rl.close();
      break;
    default:
      console.log('I didn\'t understand that. Try again!');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});