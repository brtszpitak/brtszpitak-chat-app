const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lemmatizer = new natural.Lemmatizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (input) => {
  const tokens = tokenizer.tokenize(input);
  const lemma = lemmatizer.lemmatize(tokens);
  console.log(`Normalized input: ${lemma.join(" ")}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
