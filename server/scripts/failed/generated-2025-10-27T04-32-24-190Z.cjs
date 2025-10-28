const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`AI: I'm not smart enough to understand "${line}" yet, but I'll get there!`);
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
