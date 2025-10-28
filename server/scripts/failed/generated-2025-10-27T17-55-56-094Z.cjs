console.log("Natural Language Processing (NLP) Module");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("Ask me anything > ");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim();
  console.log(`You said: ${userInput}`);

  // TO DO: Implement NLP logic here to parse and understand user input

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
