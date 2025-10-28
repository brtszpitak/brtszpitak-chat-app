console.log("Natural Language Processing (NLP) Module Integration Script");

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const userInput = "Can you understand me?";
const tokenizedInput = tokenizer.tokenize(userInput);

console.log(`Tokenized Input: ${tokenizedInput}`);

const tfidf = new natural.TfIdf();
tfidf.addDocument(userInput);

const terms = tfidf.listTerms(0);
console.log(`Term Frequency - Inverse Document Frequency (TF-IDF): ${terms}`);
