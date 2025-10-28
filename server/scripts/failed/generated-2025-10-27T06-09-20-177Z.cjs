const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const input = "I want to implement a natural language understanding module";
const tokens = tokenizer.tokenize(input);
console.log(tokens);
