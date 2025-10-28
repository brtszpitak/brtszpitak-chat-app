const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const text = "Implement a natural language processing module";

console.log("Tokenized input:", tokenizer.tokenize(text));

const nlp = require("compromise");
const doc = nlp(text);

console.log("Part-of-speech tags:", doc.out("tags"));

const intent = doc.match("#Verb").text();
console.log(`Detected intent: ${intent}`);
