const NLP = require("compromise");

function processInput(input) {
  const doc = NLP(input);
  let intent = "";
  let task = "";

  if (doc.verbs().found) {
    intent = doc.verbs().text();
  }

  if (doc.nouns().found) {
    task = doc.nouns().text();
  }

  return { intent, task };
}

console.log("Alice NLP Module");
console.log('Type "exit" to quit');

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim().toLowerCase();

  if (userInput === "exit") {
    process.exit();
  }

  const { intent, task } = processInput(userInput);
  console.log(`Intent: ${intent}, Task: ${task}`);
});

process.stdin.on("error", () => {
  process.exit();
});
