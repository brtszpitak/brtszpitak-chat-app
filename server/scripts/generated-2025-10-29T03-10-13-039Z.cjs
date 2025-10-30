const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
let lexicon = new natural.Lexicon('EN', 'noun');

console.log('Type your question or command:');
process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  let tokens = tokenizer.tokenize(input.toString().trim());
  let sentence = tokens.join(' ');
  console.log(`You said: ${sentence}`);
  
  // Very basic intent detection
  if (tokens.includes('what') && tokens.includes('is')) {
    console.log('You asked a question!');
  } else if (tokens.includes('do') || tokens.includes('make')) {
    console.log('You gave a command!');
  } else {
    console.log('I didn\'t understand that. Try again!');
  }
  
  console.log('Type your next question or command:');
});