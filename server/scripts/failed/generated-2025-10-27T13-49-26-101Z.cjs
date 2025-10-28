const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
let responses = {
  hello: "Hi! How can I assist you?",
  "what is your name": "I am Alice, a local AI collaborator.",
  "what can you do":
    "I can help with various tasks, including running Windows commands in PowerShell.",
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  let tokens = tokenizer.tokenize(input.toString().trim().toLowerCase());
  for (let response in responses) {
    if (tokens.some((token) => response.includes(token))) {
      console.log(responses[response]);
      return;
    }
  }
  console.log("I did not understand that. Please rephrase your question or command.");
});
