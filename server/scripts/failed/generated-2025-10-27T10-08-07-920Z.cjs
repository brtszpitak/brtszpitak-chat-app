const readline = require("readline");
const natural = require("natural");

let tokenizer = new natural.WordTokenizer();
let lexicon = new natural.Lexicon();

console.log("Natural Language Processing Module - Type 'exit' to quit");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  if (line.trim() === "exit") {
    rl.close();
  } else {
    let tokens = tokenizer.tokenize(line);
    console.log(`Tokenized input: ${tokens}`);
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
