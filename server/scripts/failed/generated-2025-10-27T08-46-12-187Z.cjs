const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

function processInput(input) {
  const tokens = tokenizer.tokenize(input);
  console.log(`Tokens: ${tokens.join(", ")}`);

  // Simple intent detection
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("You want to know the current time!");
  } else if (tokens.includes("help")) {
    console.log("I can assist you with various tasks. What do you need help with?");
  } else {
    console.log(`Sorry, I didn't understand your input: ${input}`);
  }
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  processInput(input.trim());
});

console.log("Welcome to Alice! Type something to get started.");
