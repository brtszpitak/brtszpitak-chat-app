const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addLemma("what", "WP");
lexer.addLemma("is", "VBZ");
lexer.addLemma("the", "DT");
lexer.addLemma("weather", "NN");
lexer.addLemma("like", "IN");
lexer.addLemma("today", "NN");

function processInput(input) {
  const tokens = tokenizer.tokenize(input);
  return lexer.tag(tokens).map(([token, tag]) => ({ token, tag }));
}

const userInput = "What is the weather like today?";
console.log(processInput(userInput));
