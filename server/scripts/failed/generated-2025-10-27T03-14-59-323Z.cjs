const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({ word: "what", tag: "question" });
lexicon.addEntry({ word: "is", tag: "auxiliary" });
lexicon.addEntry({ word: "the", tag: "article" });
lexicon.addEntry({ word: "time", tag: "noun" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const taggedTokens = tokens.map((token) => lexicon.tagToken(token));

  console.log(`Parsed: ${JSON.stringify(taggedTokens, null, 2)}`);

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
