console.log("NLP Module Prototype");

const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("Ask me anything > ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);

  // Simple intent detection example
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time:", new Date().toLocaleTimeString());
  } else {
    console.log("I did not understand. Please rephrase.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
