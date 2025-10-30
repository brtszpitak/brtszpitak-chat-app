const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("Natural Language Processing Module");
console.log("Type 'exit' to quit");

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const command = input.toString().trim().toLowerCase();
  if(command === 'exit') process.exit(0);
  
  const tokens = tokenizer.tokenize(command);
  console.log(`Tokens: ${tokens.join(', ')}`);
  
  lexer.addDocument(command, command);
  const classify = lexer.classify(command);
  console.log(`Classification: ${classify.label} (${classify.value})`);
});