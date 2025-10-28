const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const PorterStemmer = natural.PorterStemmer;
const stemmer = new PorterStemmer();

console.log("NLP Module: Type your question or command...");
process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const stemmedTokens = tokens.map((token) => stemmer.stem(token));
  console.log(`You said: ${stemmedTokens.join(" ")}`);
});
process.stdin.on("end", () => process.exit());
