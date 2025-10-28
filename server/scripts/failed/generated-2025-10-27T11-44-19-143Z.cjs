const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("Welcome! You can now interact with me using everyday conversational phrases.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);

  // Very basic intent detection, you can improve this using machine learning models
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokens.includes("hello")) {
    console.log("Hello!");
  } else {
    console.log("I didn't understand that. Please try again.");
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
