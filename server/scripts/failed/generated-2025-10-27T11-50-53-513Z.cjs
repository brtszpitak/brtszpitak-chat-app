console.log("Hello! I'm Alice. You can talk to me in a more conversational way now.");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.prompt();
rl.on("line", (line) => {
  console.log(`You said: ${line}`);
  // TO DO: integrate NLP module here to process user input
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
