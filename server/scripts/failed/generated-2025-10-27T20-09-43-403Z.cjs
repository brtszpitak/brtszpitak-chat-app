const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

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
    const date = new Date();
    console.log(`Current time is: ${date.toLocaleTimeString()}`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
