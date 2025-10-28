const Nlp = require("compromise");

console.log("Type something to talk to Alice:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = Nlp(input.trim());
  console.log(`You said: ${doc.text()}`);
  if (doc.has("#Verb")) {
    console.log(`You want to ${doc.verbs().text()}`);
  }
  if (doc.has("#ProperNoun")) {
    console.log(`You mentioned ${doc.nouns().text()}`);
  }
});
