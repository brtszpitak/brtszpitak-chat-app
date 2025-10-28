```cjs
console.log('Hello! I\'m Alice. Ask me anything.')

const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

classifier.addDocument(['hello', 'hi'], 'greeting');
classifier.addDocument(['what can you do', 'capabilities'], 'info');
classifier.train();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  const classification = classifier.classify(tokens);
  
  switch(classification) {
    case 'greeting':
      console.log('Hello! How can I assist you today?');
      break;
    case 'info':
      console.log('I can help with various tasks, such as generating code or providing information on a wide range of topics.');
      break;
    default:
      console.log('Sorry, I didn\'t understand that. Please try again!');
  }
  
  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});
```;
