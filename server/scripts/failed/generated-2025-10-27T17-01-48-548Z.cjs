const NLP = require("compromise");

console.log("Alice NLP Integration Demo");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const nlp = NLP(input.trim());
  const intent = nlp.match("#Verb").out("array")[0];
  if (intent) {
    console.log(`You want to ${intent}!`);
  } else {
    console.log("I didn't understand that.");
  }
});
