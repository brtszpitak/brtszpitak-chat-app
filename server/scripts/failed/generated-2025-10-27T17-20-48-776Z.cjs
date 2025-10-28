const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();
const ruleSet = new natural.RuleSet("EN");
const classifier = new natural.BayesClassifier();

classifier.addDocument(["hello", "hi"], "greeting");
classifier.addDocument(["goodbye", "bye"], "farewell");

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  let classification = classifier.classify(tokens);
  switch (classification) {
    case "greeting":
      console.log("AI: Hello!");
      break;
    case "farewell":
      console.log("AI: Goodbye!");
      process.exit(0);
      break;
    default:
      console.log("AI: I didn't understand that.");
  }
  rl.prompt();
});
