const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

function tokenize(input) {
  return tokenizer.tokenize(input);
}

function normalize(tokens) {
  return tokens.map((token) => token.toLowerCase());
}

function analyze(input) {
  const tokens = tokenize(input);
  const normalizedTokens = normalize(tokens);
  return normalizedTokens;
}

const responses = {
  hello: "Hi! How can I assist you?",
  hi: "Hello! What's on your mind?",
  "what is your name": "I am Alice, your local AI collaborator.",
};

function respond(input) {
  const analysis = analyze(input);
  for (const key in responses) {
    if (analysis.includes(key.toLowerCase())) {
      return responses[key];
    }
  }
  return "Sorry, I didn't understand that.";
}

const userInput = process.argv[2];
console.log(respond(userInput));
