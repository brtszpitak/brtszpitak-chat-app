const NLP = require("compromise");

console.log("Hello! I'm ready to understand you better.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = NLP(input.trim());
  console.log(`You said: ${doc.text()}`);
  if (doc.verbs().length > 0) {
    console.log(`You want me to ${doc.verbs()[0].text()}`);
  }
  if (doc.nouns().length > 0) {
    console.log(`You're talking about ${doc.nouns()[0].text()}`);
  }
});
