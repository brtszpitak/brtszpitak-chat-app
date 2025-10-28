const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("NLP Module - Type 'exit' to quit.");

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  if (line.trim() === "exit") {
    rl.close();
  } else {
    const tokens = tokenizer.tokenize(line);
    console.log(`Tokenized input: ${tokens}`);
    // TO DO: Implement NLP logic to parse and respond to user input
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
