const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokenizedInput.join(" ")}`);

  if (tokenizedInput.includes("what") && tokenizedInput.includes("time")) {
    console.log(new Date().toLocaleTimeString());
  } else if (tokenizedInput.includes("hello")) {
    console.log("Hello! How can I assist you today?");
  } else {
    console.log("I didn't understand that. Please try again!");
  }

  process.stdout.write("> ");
});
