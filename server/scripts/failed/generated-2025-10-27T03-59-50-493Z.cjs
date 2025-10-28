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
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokenized input: ${tokens.join(", ")}`);

  // Simple intent detection (extend with more advanced NLP techniques)
  if (tokens.includes("what") && tokens.includes("time")) {
    const date = new Date();
    console.log(`Current time is ${date.toLocaleTimeString()}`);
  } else {
    console.log("Unknown command or question. Try again!");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
