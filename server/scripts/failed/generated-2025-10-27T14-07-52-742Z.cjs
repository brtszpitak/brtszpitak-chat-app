console.log("Natural Language Processing (NLP) Module");
const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lemmatizer = natural.Lemmatizer;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const lemma = tokens.map((token) => lemmatizer.lemmatize(token, "en"));
  console.log(`Lemmatized input: ${lemma.join(" ")}`);

  // Add your NLP logic here to process the user's input

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
