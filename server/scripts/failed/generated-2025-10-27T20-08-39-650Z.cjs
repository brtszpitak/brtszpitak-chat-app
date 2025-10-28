console.log("NLP Module Prototype");

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
  const tokens = tokenizer.tokenize(line.toLowerCase());
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Basic intent detection
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time:", new Date().toLocaleTimeString());
  } else if (tokens.includes("help")) {
    console.log("Available commands: ...");
  } else {
    console.log("Unknown command or question.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
