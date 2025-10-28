const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const respondToQuery = (query) => {
  const tokens = tokenizer.tokenize(query);
  console.log(`You said: ${tokens.join(" ")}`);
  if (tokens.includes("nlp")) console.log("I can help with that!");
  else console.log("I didn't understand. Can you rephrase?");
};

respondToQuery(process.argv[2]);
