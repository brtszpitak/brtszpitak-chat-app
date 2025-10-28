const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (text) => {
  const tokens = tokenizer.tokenize(text.trim());
  console.log(`You said: ${tokens.join(" ")}`);
  process.exit();
});

console.log("Type something and press Enter:");
process.stdin.resume();
