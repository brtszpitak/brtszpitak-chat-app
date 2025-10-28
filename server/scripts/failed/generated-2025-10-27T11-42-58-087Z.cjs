const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the NLP module! Type a command or ask a question:");

rl.on("line", (input) => {
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${tokens.join(" ")}`);
  // TO DO: implement actual NLP logic here
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
