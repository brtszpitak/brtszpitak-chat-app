const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("I'm listening...");

rl.setPrompt('');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const stemmedTokens = tokens.map(token => parser.stem(token));
  console.log(`You said: ${stemmedTokens.join(' ')}`);
  rl.prompt();
});