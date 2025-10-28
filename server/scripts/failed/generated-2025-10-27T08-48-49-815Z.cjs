const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const lexer = new natural.Lexicon();
const parser = new natural.Parser();

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokenized = lexer.addTokens(line);
  const parsed = parser.parse(tokenized);
  console.log(`AI: ${parsed}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
