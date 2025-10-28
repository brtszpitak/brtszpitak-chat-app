const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addVerb("ask", "asks");
lexer.addVerb("give", "gives");
lexer.addNoun("question", "questions");
lexer.addNoun("command", "commands");

const parser = new natural.Parser(lexer);

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().toLowerCase());
  const sentence = parser.parse(tokenizedInput);

  if (sentence && sentence.intent) {
    console.log(`You ${sentence.intent.verb} a ${sentence.intent.noun}.`);
  } else {
    console.log("I did not understand your command.");
  }
});

console.log("Type something to interact with me...");
