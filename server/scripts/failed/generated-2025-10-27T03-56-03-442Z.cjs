const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
let aliceResponse = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);

  if (tokens.includes("hello") || tokens.includes("hi")) {
    aliceResponse = "Hello! How can I assist you today?";
  } else if (tokens.includes("what") && tokens.includes("time")) {
    aliceResponse = `The current time is ${new Date().toLocaleTimeString()}.`;
  } else {
    aliceResponse = "I didn't understand that. Please try again!";
  }

  console.log(aliceResponse);
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!");
});
