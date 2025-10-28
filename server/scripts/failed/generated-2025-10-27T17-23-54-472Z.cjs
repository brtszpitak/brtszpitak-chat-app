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
  const taggedTokens = lexer.addTokens(tokens);

  console.log(`AI: I understand you said "${line}" and identified the following keywords:`);

  taggedTokens.forEach((token, index) => {
    console.log(`  ${index + 1}. ${token.token} (${token.tag})`);
  });

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
