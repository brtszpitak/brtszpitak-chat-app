console.log("Hello! I'm happy to chat with you in everyday conversational language.");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`Alice: I understand you said "${line}"!`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
