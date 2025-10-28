const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("Type a message to interact with me:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const taggedTokens = lexer.addTokens(tokens);
  console.log(`You said: ${input}`);
  console.log(`Tokenized and tagged output:`);
  taggedTokens.forEach((token, index) => {
    console.log(`${index + 1}. ${token.token} (${token.tag})`);
  });
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!");
});
