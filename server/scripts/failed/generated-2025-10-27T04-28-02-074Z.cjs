const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello! I'm Alice. You can ask me anything or give me a command.");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);

  // Basic intent recognition
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokens.includes("hello")) {
    console.log("Hello!");
  } else {
    console.log("I didn't understand that. Try again!");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
