const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (line) => {
    const tokens = tokenizer.tokenize(line);
    console.log(`You said: ${tokens.join(" ")}`);

    // Simple intent recognition example
    if (tokens.includes("what") && tokens.includes("time")) {
      const date = new Date();
      console.log(`The current time is ${date.toLocaleTimeString()}.`);
    } else if (tokens.includes("help")) {
      console.log("I can assist you with various tasks. Ask me anything!");
    } else {
      console.log("I did not understand your request.");
    }
  })
  .on("close", () => process.exit(0));
