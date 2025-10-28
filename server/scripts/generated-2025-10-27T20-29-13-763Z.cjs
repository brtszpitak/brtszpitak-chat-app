console.log("Hello! I'm not yet capable of NLP, but I can respond to basic queries.");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  if (line.trim() === "quit") {
    process.exit(0);
  } else {
    console.log(`Alice: I'm still learning, but I'll respond when I can understand you better!`);
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
