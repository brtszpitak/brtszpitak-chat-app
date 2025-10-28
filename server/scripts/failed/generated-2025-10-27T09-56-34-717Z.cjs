console.log("Hello! I'm Alice. Please ask me a question or give an instruction.");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("");
rl.prompt();

rl.on("line", (line) => {
  console.log(`You said: ${line}`);
  // TO DO: Integrate NLP module here to understand and respond to user queries
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
