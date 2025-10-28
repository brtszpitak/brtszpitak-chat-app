console.log("Loading NLP module...");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

console.log("Ready! Type a question or command:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.trim());
  console.log(`You said: ${tokens.join(" ")}`);

  // Simple intent detection
  if (tokens.includes("what") && tokens.includes("time")) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}.`);
  } else if (tokens.includes("help")) {
    console.log("I can answer questions or perform tasks. Try asking me something!");
  } else {
    console.log("Sorry, I didn't understand that.");
  }
});

process.stdin.on("end", () => process.exit());
