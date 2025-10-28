const NLP = require("compromise");

console.log("NLP Module Loaded.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = NLP(input.trim());
  console.log(`You asked: ${doc.text()}`);
  if (doc.has("what")) {
    console.log("Answering a question...");
  } else if (doc.has("do") || doc.has("make")) {
    console.log("Executing a command...");
  }
});
