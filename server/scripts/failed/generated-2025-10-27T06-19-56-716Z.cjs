const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const text =
  "Implement a natural language processing module that allows users to interact with me using everyday language";

console.log(tokenizer.tokenize(text));
