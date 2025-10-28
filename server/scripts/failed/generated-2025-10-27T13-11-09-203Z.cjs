const natural = require("natural");

console.log("Type your question or command: ");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokenizer = new natural.WordTokenizer();
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokenizedInput.join(" ")}`);
  process.exit();
});
