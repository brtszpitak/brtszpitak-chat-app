const NLP = require("compromise");
const nlp = NLP();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const doc = nlp(input.trim());
  if (doc.has("question")) {
    console.log(`You asked: ${doc.text()}`);
  } else if (doc.has("command")) {
    console.log(`You commanded: ${doc.text()}`);
  } else {
    console.log(`I didn't understand: ${doc.text()}`);
  }
});
