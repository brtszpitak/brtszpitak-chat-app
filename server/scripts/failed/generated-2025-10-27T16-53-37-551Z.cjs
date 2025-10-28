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
  console.log(`Understanding: ${tokens.join(", ")}`);

  // Simple intent detection example
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time: " + new Date().toLocaleTimeString());
  } else if (tokens.includes("help")) {
    console.log("I can assist you with various tasks. How can I help you today?");
  } else {
    console.log("I did not understand your request. Please rephrase.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
