console.log("Natural Language Processing (NLP) Module Proposal");

const readline = require("readline");
const nlp = require("compromise");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Ask me a question or give a command: ", (answer) => {
  const doc = nlp(answer);
  console.log(`You asked/commanded: ${doc.text()}`);
  console.log(`Part-of-speech tags: ${doc.out("tags")}`);
  console.log(`Named entities: ${doc.entities().out("text")}`);
  rl.close();
});

rl.on("close", () => {
  process.exit(0);
});
