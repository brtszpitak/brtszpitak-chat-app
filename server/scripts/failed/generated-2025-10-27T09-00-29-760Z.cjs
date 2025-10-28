const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const text = "I suggest integrating a natural language processing module";
console.log(tokenizer.tokenize(text));
