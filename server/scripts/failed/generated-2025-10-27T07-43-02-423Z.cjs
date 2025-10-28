console.log("NLP Module Proposal");

const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  console.log(`Tokenized input: ${tokens}`);

  // Simple intent identification (extend with more advanced NLP techniques)
  if (tokens.includes("hello") || tokens.includes("hi")) {
    console.log("Bot: Hello! How can I assist you today?");
  } else {
    console.log("Bot: Sorry, I didn't understand that. Please try again!");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
