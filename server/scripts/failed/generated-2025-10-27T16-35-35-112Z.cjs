const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What can I help you with? ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const command = lexer.classify(tokens).best;

  switch (command.label) {
    case "DIR":
      console.log("You want to list directory contents!");
      break;
    case "MKDIR":
      console.log("You want to create a new directory!");
      break;
    case "DELETE":
      console.log("You want to delete a file or directory!");
      break;
    default:
      console.log(`I didn't understand: ${line}`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
