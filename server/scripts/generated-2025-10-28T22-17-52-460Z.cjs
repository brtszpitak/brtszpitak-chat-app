const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const intentMap = {
  'what is your name': 'My name is Alice.',
  'hello': 'Hello! How can I assist you?',
  'help': 'I can understand simple commands and questions. Try asking me something!',
  'quit': 'Goodbye!'
};

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  let response = 'I did not understand that.';
  
  Object.keys(intentMap).forEach((intent) => {
    if (tokens.some((token) => intent.includes(token))) {
      response = intentMap[intent];
    }
  });
  
  console.log(response);
  
  if (response === 'Goodbye!') process.exit();
});

process.stdin.on('end', () => process.exit());