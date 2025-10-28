const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello! I'm your AI collaborator. What can I do for you?");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`You said: ${tokens.join(" ")}`);

  // Simple intent recognition
  if (tokens.includes("what") && tokens.includes("can")) {
    console.log("I can assist you with various tasks. Ask me anything!");
  } else if (tokens.includes("help")) {
    console.log("Here to help! What do you need help with?");
  } else {
    console.log("Sorry, I didn't understand that. Try rephrasing your question or command.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
