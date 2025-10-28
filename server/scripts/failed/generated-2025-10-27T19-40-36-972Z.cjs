const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addPattern("what is my os", "Get-ComputerInfo -Property OsName,OsArchitecture");
lexer.addPattern("list files in (.*)", "Get-ChildItem $1");
lexer.addPattern("create a file named (.*)", "New-Item $1");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  let command;
  for (let pattern in lexer.patterns) {
    if (lexer.match(pattern, tokens)) {
      command = lexer.patterns[pattern].output;
      break;
    }
  }
  if (command) {
    console.log(`Running command: ${command}`);
    require("child_process").exec(`powershell -Command "${command}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.log(stdout);
      }
    });
  } else {
    console.log("Unknown command");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
