const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

console.log('Hello! I understand conversational phrases. Type something: ');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokens.join(' ')}`);
  if (tokens.includes('what') && tokens.includes('time')) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokens.includes('hello')) {
    console.log('Hello!');
  } else {
    console.log("I didn't understand that.");
  }
});