const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const taggedTokens = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const classification = lexicon.classify(token);

    if (classification !== "unknown") {
      taggedTokens.push({ token, classification });
    }
  }

  let command = "";

  for (const { token, classification } of taggedTokens) {
    switch (classification) {
      case "verb":
        command += ` ${token}`;
        break;
      case "noun":
        command += `-${token}`;
        break;
      default:
        break;
    }
  }

  console.log(`PowerShell Command: powershell.exe ${command.trim()}`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
