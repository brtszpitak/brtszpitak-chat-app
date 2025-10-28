const readline = require("readline");
const natural = require("natural");

let tokenizer = new natural.WordTokenizer();
let lexicon = new natural.Lexicon();

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    let tokens = tokenizer.tokenize(input);
    console.log(`You said: ${tokens.join(" ")}`);

    // Very basic intent detection, replace with a more advanced NLU model
    if (tokens.includes("hello")) {
      console.log("Hello! How can I assist you today?");
    } else if (tokens.includes("help")) {
      console.log("I can help you with various tasks. What do you need help with?");
    } else {
      console.log("I did not understand that. Please rephrase your question or instruction.");
    }
  })
  .on("close", () => process.exit(0));
