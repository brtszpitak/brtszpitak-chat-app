const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({ word: "what", tag: "question" });
lexicon.addEntry({ word: "is", tag: "question" });
lexicon.addEntry({ word: "how", tag: "question" });
lexicon.addEntry({ word: "do", tag: "command" });
lexicon.addEntry({ word: "can", tag: "command" });

const classifier = new natural.BayesClassifier(lexicon);

classifier.train([
  { input: "what is your name", category: "question" },
  { input: "how are you", category: "question" },
  { input: "do something", category: "command" },
  { input: "can you help me", category: "command" },
]);

const userInput = prompt("You: ");
const tokens = tokenizer.tokenize(userInput.toLowerCase());
const classification = classifier.classify(tokens.join(" "));

if (classification === "question") {
  console.log("I will answer your question...");
} else if (classification === "command") {
  console.log("I will execute your command...");
}
