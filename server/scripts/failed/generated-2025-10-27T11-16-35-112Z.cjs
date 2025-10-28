const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

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
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("Current time: " + new Date().toLocaleTimeString());
  } else if (tokens.includes("run") && tokens.includes("command")) {
    const command = tokens.slice(tokens.indexOf("run") + 1).join(" ");
    console.log(`Running command: ${command}`);
    // TO DO: Implement actual command execution
  } else {
    console.log("Unknown intent");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
