console.log("Natural Language Understanding Module");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim();
  if (userInput === "exit") {
    rl.close();
  } else {
    console.log(`AI: I'm not yet smart enough to understand "${userInput}"`);
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
