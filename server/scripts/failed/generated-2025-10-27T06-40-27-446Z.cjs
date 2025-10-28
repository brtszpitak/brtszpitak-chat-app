const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const tokenizedInput = tokenizer.tokenize(input.trim());
  console.log(`You said: ${tokenizedInput.join(" ")}`);

  if (tokenizedInput.includes("hello")) {
    console.log("Hello! How can I assist you today?");
  } else if (tokenizedInput.includes("what") && tokenizedInput.includes("time")) {
    const date = new Date();
    console.log(`The current time is ${date.toLocaleTimeString()}`);
  } else {
    console.log("I did not understand that. Please try again!");
  }

  process.stdout.write("> ");
});

process.stdin.on("end", () => {
  process.exit(0);
});

process.stdout.write("> ");
