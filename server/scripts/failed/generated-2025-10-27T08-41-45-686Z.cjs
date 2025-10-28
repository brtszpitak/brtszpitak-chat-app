const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);
  // TO DO: implement NLP logic here
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
