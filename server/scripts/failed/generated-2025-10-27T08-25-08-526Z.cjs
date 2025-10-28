const nlp = require("compromise");

console.log("I'm ready to chat! Ask me anything.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.toString().trim());
  const sentences = doc.sentences();

  for (let sentence of sentences) {
    if (sentence.verbs().length > 0) {
      console.log(`You want me to ${sentence.verbs()[0].text()}`);
    } else if (sentence.nouns().length > 0) {
      console.log(`You mentioned ${sentence.nouns()[0].text()}`);
    } else {
      console.log("I didn't understand that.");
    }
  }

  console.log();
});
