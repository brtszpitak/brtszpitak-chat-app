const readline = require("readline");
const natural = require("natural");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const nlp = new natural.LangGuesser();

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const lang = nlp.guess(line);
  console.log(`Detected language: ${lang}`);
  if (lang === "en") {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(line);
    console.log(`Tokens: ${tokens.join(", ")}`);
    // TO DO: implement intent detection and task execution
    rl.prompt();
  } else {
    console.log("Language not supported");
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
