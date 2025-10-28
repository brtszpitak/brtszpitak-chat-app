const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (input) => {
  const tokens = tokenizer.tokenize(input);
  const taggedTokens = lexer.addTokens(tokens);

  console.log(`Tagged tokens: ${JSON.stringify(taggedTokens, null, 2)}`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
