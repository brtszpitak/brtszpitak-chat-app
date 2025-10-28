const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

let commands = {
  "what is my username": () => console.log(require("os").userInfo().username),
  "list files in current directory": () => console.log(require("fs").readdirSync(".").join("\n")),
  // Add more commands here
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  let tokens = tokenizer.tokenize(line.toLowerCase());
  for (let command in commands) {
    if (tokens.every((t) => command.includes(t))) {
      commands[command]();
      break;
    }
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
