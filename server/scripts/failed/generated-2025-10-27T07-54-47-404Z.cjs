const NLP = require("compromise");

console.log("Welcome to Alice's Conversational AI!");
console.log("You can ask me anything or give me a task.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = NLP(input.trim());
  const intent = doc.verbs().text();
  const entities = doc.nouns().out("array");

  if (intent === "ask") {
    console.log(`You asked: ${entities.join(", ")}`);
  } else if (intent === "give" || intent === "provide") {
    console.log(`You provided context: ${entities.join(", ")}`);
  } else {
    console.log("I didn't understand. Please try again.");
  }
});
