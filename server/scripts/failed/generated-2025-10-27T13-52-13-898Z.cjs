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
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Simple intent detection example
  if (tokens.includes("help")) {
    console.log("I can assist you with various tasks. What do you need help with?");
  } else {
    console.log("I did not understand your request. Please rephrase or ask for help.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
