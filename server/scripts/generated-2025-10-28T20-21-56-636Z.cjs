const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lemmatizer = new natural.Lemmatizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const lemma = lemmatizer.lemmatize(tokens);

  console.log(`You said: ${lemma.join(' ')}`);

  if (lemma.includes('what') && lemma.includes('time')) {
    const date = new Date();
    console.log(`Current time is: ${date.toLocaleTimeString()}`);
  } else if (lemma.includes('hello')) {
    console.log('Hello! How can I assist you today?');
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});