const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const stemmedTokens = tokens.map((token) => stemmer.stem(token));
  console.log(`Stemmed tokens: ${stemmedTokens.join(", ")}`);

  // TO DO: implement NLP logic to understand user input and respond accordingly

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
