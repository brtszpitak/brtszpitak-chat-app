const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello! You can ask me anything or give commands in everyday conversational language.");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  lexer.addDocument(tokens, line);
  console.log(`You said: ${line}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
