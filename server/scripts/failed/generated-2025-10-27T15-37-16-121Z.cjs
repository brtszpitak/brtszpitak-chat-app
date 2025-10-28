const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");

console.log('Natural Language Understanding Module - Type "exit" to quit');

process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokens.join(" ")}`);

  if (tokens.includes("exit")) process.exit(0);
});
