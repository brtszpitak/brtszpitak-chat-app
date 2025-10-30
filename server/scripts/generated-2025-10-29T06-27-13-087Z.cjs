const readline = require('readline');
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(', ')}`);
  
  // Example NLP task: Check if the input contains a question
  const isQuestion = tokens.some(token => ['what', 'where', 'when', 'who', 'why', 'how'].includes(token.toLowerCase()));
  if (isQuestion) {
    console.log('You asked a question!');
  } else {
    console.log('You gave a command!');
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});