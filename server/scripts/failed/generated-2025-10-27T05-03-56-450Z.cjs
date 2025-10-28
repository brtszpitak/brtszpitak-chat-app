const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const command = lexer.classify(tokens).best;

  switch (command.label) {
    case "LIST_FILES":
      console.log("Listing files...");
      // TO DO: implement listing files functionality
      break;
    case "CREATE_FILE":
      console.log("Creating file...");
      // TO DO: implement creating file functionality
      break;
    default:
      console.log(`Unknown command: ${command.label}`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
