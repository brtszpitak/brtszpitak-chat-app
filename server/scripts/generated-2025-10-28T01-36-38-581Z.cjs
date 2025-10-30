const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const parser = new natural.LazySyllableParser();

process.stdin.setEncoding('utf8');

console.log('NLP Module: Ask me anything...');

process.stdin.on('data', (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokenizedInput.join(' ')}`);

  // Simple intent detection
  if (tokenizedInput.includes('what') && tokenizedInput.includes('time')) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokenizedInput.includes('hello')) {
    console.log('Hello! How can I assist you today?');
  } else {
    console.log('I did not understand. Please rephrase your question or command.');
  }
});