const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tokenizer = new natural.WordTokenizer();

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (input) => {
  const tokens = tokenizer.tokenize(input);
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Very basic intent detection, you would need a more advanced NLP approach
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokens.includes("list") && tokens.includes("files")) {
    console.log("Implement file listing functionality");
  } else {
    console.log("Unknown command");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
