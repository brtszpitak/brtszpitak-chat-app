const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

let responses = {
  hello: "Hi! How can I assist you?",
  "what is your name": "My name is Alice.",
  help: "I can help with various tasks. What do you need help with?",
};

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim().toLowerCase());
  let response = "";

  Object.keys(responses).forEach((key) => {
    if (tokenizedInput.some((word) => key.includes(word))) {
      response = responses[key];
    }
  });

  if (!response) {
    response = "I didn't understand that. Please try again.";
  }

  console.log(response);
});
