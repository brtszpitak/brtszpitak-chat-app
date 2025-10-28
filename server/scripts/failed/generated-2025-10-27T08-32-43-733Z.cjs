const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Alice: Hi! You said ${tokens.join(" ")}.`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
