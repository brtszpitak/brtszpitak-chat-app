const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer('en');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! I\'m Alice, your AI collaborator. You can talk to me in everyday conversational phrases.');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const stemmedTokens = tokens.map(token => parser.stem(token));
  const intent = stemmedTokens.join(' ');

  switch (intent) {
    case 'what can you do':
      console.log('I can assist with various tasks, such as generating code or providing information on a wide range of topics.');
      break;
    default:
      console.log(`Sorry, I didn't understand "${line}".`);
  }

  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});