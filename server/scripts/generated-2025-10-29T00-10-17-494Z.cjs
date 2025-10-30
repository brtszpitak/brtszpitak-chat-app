const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addLexer("en");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Ask me anything > ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(' ')}`);
  
  // Very basic intent detection, you would need a more advanced NLP model for this
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time is " + new Date().toLocaleTimeString());
  } else {
    console.log("I didn't understand that. Please try again.");
  }
  
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});