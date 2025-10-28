console.log("Natural Language Processing (NLP) Module Proposal");

const readline = require("readline");
const nlp = require("compromise");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const doc = nlp(line);
  console.log(`Parsed sentence: ${doc.out("text")}`);
  console.log(`Part-of-speech tags: ${JSON.stringify(doc.tags())}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
