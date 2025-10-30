const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("NLP Module v1.0 - Type 'exit' to quit.");
process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const command = tokens[0].toLowerCase();
  
  if(command === 'what') {
    console.log("You asked a question. Currently, I can only respond to simple queries.");
  } else if(command === 'exit') {
    process.exit(0);
  } else {
    console.log(`Unknown command: ${command}`);
  }
});