const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokenized = tokenizer.tokenize(line);
  console.log(`Tokenized: ${tokenized.join(", ")}`);

  // Simple intent recognition example
  if (tokenized.includes("what") && tokenized.includes("time")) {
    console.log("Current time:", new Date().toLocaleTimeString());
  } else {
    console.log("Unknown command or question.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
