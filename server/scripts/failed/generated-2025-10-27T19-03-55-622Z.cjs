const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const parser = new natural.SentenceParser();

process.stdin.setEncoding("utf8");

console.log("NLP Module: Ask me anything or give a command...");

process.stdin.on("data", (input) => {
  const sentence = input.toString().trim();
  const tokenized = tokenizer.tokenize(sentence);
  const parsed = parser.parse(sentence);

  switch (parsed.root.label) {
    case "NP": // Noun Phrase
      console.log(`You asked about ${tokenized.join(" ")}`);
      break;
    case "VP": // Verb Phrase
      console.log(`You want to ${tokenized.join(" ")}`);
      break;
    default:
      console.log("Sorry, I didn't understand that.");
  }
});
