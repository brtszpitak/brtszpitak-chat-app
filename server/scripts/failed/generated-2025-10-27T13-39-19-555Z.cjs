const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addTerm("what", "question");
lexer.addTerm("is", "auxiliary");
lexer.addTerm("the", "article");
lexer.addTerm("time", "noun");
lexer.addTerm("?", "punctuation");

const commandMap = {
  question: (tokens) => {
    if (tokens.includes("time")) {
      console.log(new Date().toLocaleTimeString());
    }
  },
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  const taggedTokens = lexer.tag(tokens);
  const intent = taggedTokens.find(
    (token) => token.tag !== "article" && token.tag !== "punctuation"
  );

  if (intent) {
    commandMap[intent.tag](tokens);
  }
});

console.log("NLP module ready. Type a question or command:");
