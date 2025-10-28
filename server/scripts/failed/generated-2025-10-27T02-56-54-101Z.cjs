console.log(
  "Hello! I'm happy to chat with you in everyday conversational language. However, please note that this script doesn't actually implement an NLP module, as it's beyond the scope of a single script."
);

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`Alice: I understand you said "${line}".`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
