const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const parser = new natural.LazySingularizer();

process.stdin.setEncoding("utf8");

console.log("Welcome! You can now interact with me using everyday language.");

process.stdin.on("data", (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  const normalizedInput = tokenizedInput.map((word) => parser.singularize(word));
  const command = normalizedInput.join(" ");

  switch (command.toLowerCase()) {
    case "hello":
      console.log("Hello! How can I assist you today?");
      break;
    case "what is your name":
      console.log("My name is Alice, and I'm here to help.");
      break;
    default:
      console.log(`Sorry, I didn't understand '${command}'. Please try again.`);
  }
});
