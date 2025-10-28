console.log("Hello! I'm Alice. You can talk to me in everyday language.");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`Alice: I didn't understand that. Can you please rephrase?`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
