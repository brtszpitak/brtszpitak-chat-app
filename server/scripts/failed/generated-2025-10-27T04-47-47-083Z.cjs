const NLP = require("compromise");

console.log("Welcome to Alice! I can understand natural language inputs.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = NLP(input.trim());
  console.log(`You said: ${doc.text()}`);
  if (doc.has("#Verb")) {
    const verb = doc.match("#Verb").text();
    console.log(`I understand you want to ${verb}.`);
  }
});
