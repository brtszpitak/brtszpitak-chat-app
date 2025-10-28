const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lda = new natural.LDA();

console.log("Welcome! You can now interact with me using everyday language.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  lda.addDocument(tokens);
  console.log(`You said: ${line}`);
  console.log(`Tokens: ${tokens.join(", ")}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
