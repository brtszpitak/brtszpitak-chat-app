const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    const tokens = tokenizer.tokenize(input);
    const taggedTokens = [];

    for (let i = 0; i < tokens.length; i++) {
      taggedTokens.push(lexicon.tag(tokens[i]));
    }

    console.log(`You said: ${input}`);
    console.log(`Tokenized and tagged output: ${JSON.stringify(taggedTokens)}`);
  })
  .on("close", () => process.exit(0));
