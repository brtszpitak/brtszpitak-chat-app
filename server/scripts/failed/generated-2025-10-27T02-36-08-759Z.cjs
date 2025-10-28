console.log("Natural Language Processing (NLP) Module Prototype");

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

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(", ")}`);

  lexer.addDocument(line, "user_query");
  const classified = lexer.classify(line);
  console.log(`Classification: ${classified.label} (${classified.value})`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
