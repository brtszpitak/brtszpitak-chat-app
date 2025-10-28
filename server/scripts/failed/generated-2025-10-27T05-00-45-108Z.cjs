const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${input}`);
  console.log(`Tokenized: ${tokens.join(", ")}`);
});
