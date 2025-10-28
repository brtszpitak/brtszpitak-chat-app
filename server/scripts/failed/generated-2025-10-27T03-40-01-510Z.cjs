console.log("Natural Language Understanding Module");

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

  // Very basic intent recognition, extend this to your needs
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokens.includes("hello")) {
    console.log("Hello!");
  } else {
    console.log("I didn't understand that.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
