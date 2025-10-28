const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

console.log("NLP Module Ready! Type a command or question:");
process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokens.join(" ")}`);

  // Simple intent detection
  if (tokens.includes("what") && tokens.includes("time")) {
    console.log("The current time is:", new Date().toLocaleTimeString());
  } else if (tokens.includes("hello")) {
    console.log("Hello! I'm happy to assist you.");
  } else {
    console.log("I didn't understand that. Please try again!");
  }
});

process.stdin.on("end", () => {
  console.log("Goodbye!");
});
