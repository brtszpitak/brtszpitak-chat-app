const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    const tokens = tokenizer.tokenize(input);
    console.log(`You said: ${tokens.join(" ")}`);

    // Simple intent detection example
    if (tokens.includes("what") && tokens.includes("time")) {
      console.log("Current time is:", new Date().toLocaleTimeString());
    } else if (tokens.includes("hello")) {
      console.log("Hello! I'm Alice, nice to meet you!");
    } else {
      console.log("Sorry, I didn't understand that.");
    }
  })
  .on("close", () => process.exit(0));
