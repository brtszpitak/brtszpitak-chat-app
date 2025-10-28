const NLP = require("compromise");

function processInput(input) {
  const doc = NLP(input);
  if (doc.verbs().length > 0) {
    const verb = doc.verbs().text();
    const noun = doc.nouns().text();
    console.log(`You want to ${verb} the ${noun}`);
  } else if (doc.questions().length > 0) {
    console.log("You asked a question!");
  } else {
    console.log("I did not understand your input.");
  }
}

console.log("Type something to interact with me:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => processInput(data.trim()));
