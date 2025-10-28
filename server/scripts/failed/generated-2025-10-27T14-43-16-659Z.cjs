const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const parser = new natural.Lexicon();

parser.addPattern("what is *", "query");
parser.addPattern("* help", "help");
parser.addPattern("list *", "list");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  const result = parser.parse(tokens);
  if (result) {
    switch (result.intent) {
      case "query":
        console.log(`You asked: ${tokens[1]}`);
        break;
      case "help":
        console.log("I can help you with...");
        break;
      case "list":
        console.log(`Listing ${tokens[1]}...`);
        break;
    }
  } else {
    console.log("I did not understand that.");
  }
});
