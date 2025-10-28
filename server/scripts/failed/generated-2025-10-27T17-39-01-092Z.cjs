const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({word: 'what', tag: 'question'});
lexicon.addEntry({word: 'is', tag: 'question'});
lexicon.addEntry({word: 'time', tag: 'query'});
lexicon.addEntry({word: 'help', tag: 'command'});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  let intent;
  for (let token of tokens) {
    if (lexicon.contains(token, 'question')) {
      intent = 'ask';
      break;
    } else if (lexicon.contains(token, 'query')) {
      intent = 'query';
      break;
    } else if (lexicon.contains(token, 'command')) {
      intent = 'execute';
      break;
  }
  
  switch (intent) {
    case 'ask':
      console.log('You asked a question!');
      break;
    case 'query':
      console.log('You made a query!');
      break;
    case 'execute':
      console.log('You gave a command!');
      break;
    default:
      console.log('I didn\'t understand that.');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});