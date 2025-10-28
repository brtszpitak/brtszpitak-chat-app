const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const normalizedTokens = tokens.map((token) => parser.stem(token));
  console.log(`You said: ${normalizedTokens.join(" ")}`);
});

console.log("Hello! I'm Alice. Type something to interact with me.");
