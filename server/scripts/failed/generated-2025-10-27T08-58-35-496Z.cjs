const NLP = require("compromise");

function processInput(input) {
  const doc = NLP(input);
  let intent, entity;

  if (doc.match("# Verb").found) {
    intent = "action";
    entity = doc.match("# Verb").text();
  } else if (doc.match("# QuestionWord").found) {
    intent = "question";
    entity = doc.match("# QuestionWord").text();
  }

  return { intent, entity };
}

console.log("Type a command or ask a question:");
process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const result = processInput(input.trim());
  console.log(`Intent: ${result.intent}, Entity: ${result.entity}`);
});

process.stdin.on("end", () => process.stdout.write("Goodbye!"));
