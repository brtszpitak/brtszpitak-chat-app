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
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Very basic command recognition, replace with a more advanced NLP model
  if (tokens.includes("list") && tokens.includes("files")) {
    console.log("You want to list files!");
  } else if (tokens.includes("create") && tokens.includes("folder")) {
    console.log("You want to create a folder!");
  } else {
    console.log("I didn't understand that.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
