const fs = require("fs");
const path = require("path");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const fileContent = fs.readFileSync(path.join(__dirname, "user_queries.txt"), "utf8");
const queries = fileContent.split("\n").filter(Boolean);

queries.forEach((query) => {
  const tokens = tokenizer.tokenize(query);
  console.log(`Query: ${query}`);
  console.log(`Tokens: ${tokens.join(", ")}`);
});
