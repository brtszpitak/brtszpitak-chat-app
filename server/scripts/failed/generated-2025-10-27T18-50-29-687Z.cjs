const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${input}`);
  console.log(`Tokens: ${tokens.join(", ")}`);

  if (tokens.includes("hello")) {
    console.log("Hello! How can I assist you today?");
  } else if (tokens.includes("help")) {
    console.log("I can help you with tasks. What do you need help with?");
  } else {
    console.log("I did not understand that. Please try again.");
  }
});
