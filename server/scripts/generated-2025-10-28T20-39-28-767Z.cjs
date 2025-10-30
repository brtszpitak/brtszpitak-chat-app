const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lemmatizer = new natural.Lemmatizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const lemma = lemmatizer.lemmatize(tokens);

  console.log(`You said: ${lemma.join(' ')}`);

  // Simple intent detection example
  if (lemma.includes('help')) {
    console.log('I can assist you with various tasks. What would you like to know?');
  } else if (lemma.includes('command')) {
    console.log('Please provide a specific command, and I\'ll do my best to execute it.');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});