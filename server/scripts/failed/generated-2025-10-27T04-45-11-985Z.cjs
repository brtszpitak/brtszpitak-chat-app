const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addVerb("what", "is");
lexer.addVerb("list", "commands");
lexer.addVerb("ask", "question");
lexer.addVerb("tell", "me");
lexer.addVerb("show", "help");

const respond = (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  let response = "";

  for (let token of tokens) {
    if (lexer.contains(token)) {
      switch (token) {
        case "what":
          response += "You can ask me questions or give commands.\n";
          break;
        case "list":
          response += "Available commands: what, list, ask, tell, show\n";
          break;
        case "ask":
          response += "I'm here to help. What would you like to know?\n";
          break;
        case "tell":
          response += "Go ahead and ask your question.\n";
          break;
        case "show":
          response += 'Type "list" to see available commands.\n';
          break;
      }
    }
  }

  return response.trim();
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  console.log(respond(input));
});
