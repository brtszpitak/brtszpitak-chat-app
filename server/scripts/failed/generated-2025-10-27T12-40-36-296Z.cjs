const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokens.join(" ")}`);
});

console.log("Hello! I'm Alice. Talk to me.");
