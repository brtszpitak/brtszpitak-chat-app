const nlp = require("compromise");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.trim());
  if (doc.has("#Question")) {
    console.log(`You asked: ${doc.text()}`);
  } else if (doc.has("#Command")) {
    console.log(`You commanded: ${doc.text()}`);
  } else {
    console.log("Unable to understand your input.");
  }
});
