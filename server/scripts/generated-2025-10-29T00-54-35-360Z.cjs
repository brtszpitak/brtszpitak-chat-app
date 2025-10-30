const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokenizedInput.join(' ')}`);
  
  // Very basic intent recognition
  if (tokenizedInput.includes('hello')) {
    console.log('Hi! How can I assist you today?');
  } else if (tokenizedInput.includes('what') && tokenizedInput.includes('time')) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}`);
  } else {
    console.log('I did not understand your query. Please try rephrasing it.');
  }
});

process.stdin.on('end', () => process.stdout.write('Goodbye!'));