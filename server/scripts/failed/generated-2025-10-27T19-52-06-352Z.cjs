console.log("Hello! I'm Alice.");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt("You: ");
rl.prompt();
rl.on("line", (line) => {
  console.log(`Alice: You said "${line}"`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
