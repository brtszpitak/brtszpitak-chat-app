const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

console.log("NLP Module Ready! Type a command or question:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.trim().toLowerCase());
  const stemmedTokens = tokens.map((token) => parser.stem(token));
  console.log(`You said: ${stemmedTokens.join(" ")}`);
  // TO DO: implement intent recognition and task execution
});
