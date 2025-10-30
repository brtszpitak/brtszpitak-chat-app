const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const PorterStemmer = natural.PorterStemmer;
let intentMap = {
  'what is your name': 'My name is Alice.',
  'hello': 'Hello! How can I assist you?',
  'help': 'I can understand natural language. Ask me anything or give a command.'
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  const stemmedTokens = tokens.map((token) => PorterStemmer.stem(token));
  let response = 'I did not understand. Please rephrase.';
  Object.keys(intentMap).forEach((intent) => {
    if (stemmedTokens.every((token, index) => intent.split(' ')[index] === token)) {
      response = intentMap[intent];
    }
  });
  console.log(response);
});