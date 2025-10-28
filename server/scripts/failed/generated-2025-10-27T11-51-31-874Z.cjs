const NLP = require("compromise");

console.log("Welcome to Alice! Type something to chat with me.");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = NLP(input.trim());
  if (doc.has("#Verb")) {
    console.log(`You want me to ${doc.verbs().text()}`);
  } else {
    console.log("I didn't understand that. Try again!");
  }
});
