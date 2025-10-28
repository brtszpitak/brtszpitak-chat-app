const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(", ")}`);

  // simple intent detection example
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time:", new Date().toLocaleTimeString());
  } else if (tokens.includes("help")) {
    console.log("Available commands: ...");
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
