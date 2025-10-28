console.log("Hello! I'm happy to chat with you.");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`AI: Hi, I understand you said "${line}".`);
  rl.prompt();
});
