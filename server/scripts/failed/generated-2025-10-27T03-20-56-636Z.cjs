const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const parser = natural.BracketParser;

async function processInput(input) {
  const tokenized = tokenizer.tokenize(input);
  const parsed = parser.parse(tokenized);

  if (parsed.expressions[0].tag === "ask") {
    console.log(`You asked: ${parsed.expressions[0].text}`);
  } else if (parsed.expressions[0].tag === "command") {
    console.log(`You commanded: ${parsed.expressions[0].text}`);
    // TO DO: implement PowerShell command execution
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  processInput(input.toString().trim());
});
