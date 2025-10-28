const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the NLP module! Type a command or ask a question:");

rl.on("line", (input) => {
  const tokens = tokenizer.tokenize(input);
  const taggedTokens = lexer.addTokens(tokens);

  let command = "";
  for (let i = 0; i < taggedTokens.length; i++) {
    if (taggedTokens[i].tag === "VB" || taggedTokens[i].tag === "NN") {
      command += taggedTokens[i].token + " ";
    }
  }

  console.log(`You said: ${input}`);
  console.log(`Parsed command: ${command.trim()}`);

  // TO DO: Implement Windows command execution based on parsed command
  // For now, just echo the parsed command
  console.log(`Would execute: ${command.trim()}`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

rl.prompt();
