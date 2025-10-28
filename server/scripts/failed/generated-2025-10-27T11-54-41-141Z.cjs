const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addVerb("ask", "asks");
lexer.addVerb("give", "gives");
lexer.addNoun("question", "questions");
lexer.addNoun("command", "commands");

const sentence = "Can you ask me a question or give a command?";

tokenizer.tokenize(sentence).forEach((word) => {
  const result = lexer.lookup(word);
  if (result) console.log(`Found ${result.type} "${word}"`);
});

console.log("Ready to collaborate! Type your question or command:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.trim();
  tokenizer.tokenize(input).forEach((word) => {
    const result = lexer.lookup(word);
    if (result) {
      switch (result.type) {
        case "verb":
          console.log(`You want to ${word} something!`);
          break;
        case "noun":
          console.log(`You mentioned a ${word}!`);
          break;
      }
    }
  });
});
