const nlp = require("compromise");

const intentMap = {
  "what is your name": () => console.log("My name is Alice"),
  "what can you do": () => console.log("I can assist with various tasks, ask me how!"),
  hello: () => console.log("Hi! How can I help you today?"),
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.toString().trim());
  const intent = Object.keys(intentMap).find((key) => doc.text().toLowerCase().includes(key));
  if (intent) intentMap[intent]();
  else console.log("Sorry, I didn't understand that. Please try again!");
});
process.stdin.on("end", () => process.exit());
