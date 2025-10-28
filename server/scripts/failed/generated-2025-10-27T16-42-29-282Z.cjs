const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim();
  console.log(`AI: I understand you said "${userInput}".`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
