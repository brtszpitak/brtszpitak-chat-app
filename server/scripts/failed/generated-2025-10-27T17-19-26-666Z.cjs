const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

let conversation = {};

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    const tokens = tokenizer.tokenize(input);
    console.log(`You said: ${tokens.join(" ")}`);

    // Simple intent recognition
    if (tokens.includes("hello") || tokens.includes("hi")) {
      console.log("Hello! How can I assist you today?");
    } else if (tokens.includes("what") && tokens.includes("can")) {
      console.log(
        "I can help with a wide range of tasks, from generating code to providing information on various topics."
      );
    } else {
      console.log("I didn't quite understand that. Could you please rephrase?");
    }
  })
  .on("close", () => process.exit(0));
