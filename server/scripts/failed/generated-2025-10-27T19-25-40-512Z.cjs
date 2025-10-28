const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const text = "Can you propose concrete Windows commands to achieve tasks?";

tokenizer.tokenize(text).forEach((token) => {
  console.log(token);
});
