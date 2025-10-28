const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(", ")}`);

  // Simple command recognition
  if (tokens.includes("hello")) {
    console.log("Hello!");
  } else if (tokens.includes("what") && tokens.includes("time")) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}`);
  } else {
    console.log("I did not understand your command.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
