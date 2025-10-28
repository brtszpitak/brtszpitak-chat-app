const nlp = require("compromise");

console.log("I'm listening... Type something:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.toString().trim());
  console.log(`You said: ${doc.text()}`);
  if (doc.has("#Verb")) {
    console.log(`You want to ${doc.match("#Verb").text()}`);
  }
  if (doc.has("#Noun")) {
    console.log(`You mentioned ${doc.match("#Noun").text()}`);
  }
});
