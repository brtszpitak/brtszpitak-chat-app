console.log(
  "Hello! I'm happy to chat with you in everyday conversational language. However, as a proof of concept, I'll just echo your input for now."
);

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`Alice: ${line}`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
