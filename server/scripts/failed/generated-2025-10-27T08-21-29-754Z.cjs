const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("NLP Module Ready! Type a command or question:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const taggedTokens = lexer.addTokens(tokens);
  console.log(taggedTokens);
  process.stdout.write("> ");
});
