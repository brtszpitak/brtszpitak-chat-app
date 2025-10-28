const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    const tokens = tokenizer.tokenize(input);
    const taggedTokens = lexer.addTokens(tokens);

    console.log(`You said: ${input}`);
    console.log(`Tokenized: ${tokens.join(", ")}`);
    console.log(`Tagged: ${taggedTokens.map((t) => `${t.token} (${t.tag})`).join(", ")}`);

    // TO DO: implement intent detection and PowerShell command generation
    // For now, just echo the input
    console.log(`Executing: ` + input);
  })
  .on("close", () => {
    process.exit(0);
  });
