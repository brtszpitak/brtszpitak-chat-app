const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(
    `Alice: I understand you said "${tokens.join(" ")}". However, I'm not yet capable of providing a meaningful response. This feature is still in development.`
  );
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
