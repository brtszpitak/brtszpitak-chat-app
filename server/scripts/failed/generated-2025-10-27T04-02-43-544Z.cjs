const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const PorterStemmer = natural.PorterStemmer;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const stemmedTokens = tokens.map((token) => PorterStemmer.stem(token));
  console.log(`Alice: You said ${stemmedTokens.join(" ")}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
