const nlp = require("compromise");

console.log("I'm ready to chat! Type something:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.trim());
  if (doc.match("suggest *").found) {
    console.log("You're suggesting something!");
  } else if (doc.match("implement *").found) {
    console.log("Let's implement that!");
  } else {
    console.log("I didn't quite understand. Try again?");
  }
});
