console.log("NLP Module Proposal");

const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(line);

  console.log(`Tokens: ${tokens.join(", ")}`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
