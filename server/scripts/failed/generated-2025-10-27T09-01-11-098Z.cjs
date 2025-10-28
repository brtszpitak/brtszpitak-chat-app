const nlp = require("nlp-compromise");

console.log("Natural Language Processing (NLP) module integrated.");

const sentence = "What's the weather like today?";
const doc = nlp.text(sentence).out();

console.log(`You asked: ${sentence}`);
console.log(`Extracted intent: ${doc.verbs().data()[0].normal}`);
