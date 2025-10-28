const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("I'm listening...");

rl.setPrompt("");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);

  // Very basic intent detection example
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("It's " + new Date().toLocaleTimeString());
  } else if (tokens.includes("help")) {
    console.log("I'm here to assist you.");
  } else {
    console.log("Sorry, I didn't understand that.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
