const readline = require("readline");
const nlp = require("compromise");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello! I'm Alice. You can ask me anything or give instructions.");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const doc = nlp(line);
  if (doc.verbs().length > 0) {
    console.log(`You want me to ${doc.verbs().data()[0].normal}`);
  } else if (doc.questions().length > 0) {
    console.log("I'm not sure I understand your question.");
  } else {
    console.log("I didn't quite catch that.");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
