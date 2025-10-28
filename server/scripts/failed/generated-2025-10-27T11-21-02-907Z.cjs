console.log("Natural Language Processing (NLP) Module Demo");

const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("Ask me anything > ");
rl.prompt();

rl.on("line", (line) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(line);

  console.log(`You said: ${tokens.join(" ")}`);

  // Simple command recognition demo
  if (tokens.includes("hello")) {
    console.log("Hello!");
  } else if (tokens.includes("help")) {
    console.log("I can assist with NLP-related tasks. What do you need help with?");
  } else {
    console.log("I didn't understand that. Please try again!");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
