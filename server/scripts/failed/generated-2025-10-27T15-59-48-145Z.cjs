const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();
const ruleSet = new natural.RuleSet("EN");

const sentences = [
  "What is the weather like today?",
  "Can you create a new folder on desktop?",
  "Tell me about artificial intelligence.",
];

sentences.forEach((sentence) => {
  const tokens = tokenizer.tokenize(sentence);
  const taggedTokens = lexicon.addTokens(tokens);
  const matches = ruleSet.match(taggedTokens);

  if (matches.length > 0) {
    console.log(`Matched intent: ${matches[0].tag}`);
  } else {
    console.log("No match found");
  }
});
