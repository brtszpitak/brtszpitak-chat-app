const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Example NLP commands
  if (tokens.includes("what") && tokens.includes("time")) {
    const date = new Date();
    console.log(`Current time is: ${date.toLocaleTimeString()}`);
  } else if (tokens.includes("hello")) {
    console.log("Hello! How can I assist you today?");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
