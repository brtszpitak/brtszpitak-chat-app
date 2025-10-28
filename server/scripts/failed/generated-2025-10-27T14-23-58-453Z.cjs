const NLP = require("compromise");

function processInput(input) {
  const doc = NLP(input);
  if (doc.has("command")) {
    const command = doc.match("#Command").text();
    console.log(`Received command: ${command}`);
  } else if (doc.has("question")) {
    const question = doc.match("#Question").text();
    console.log(`Received question: ${question}`);
  } else {
    console.log("Unknown input");
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => processInput(data.trim()));
console.log("Ready to receive natural language inputs...");
