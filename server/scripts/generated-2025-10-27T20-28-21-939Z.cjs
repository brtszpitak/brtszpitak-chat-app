const NLP = require("compromise");

console.log("Natural Language Processing (NLP) Module");

const userInput = "What is the current date?";
const doc = NLP(userInput);

if (doc.has("#Question")) {
  console.log(`You asked: ${doc.text()}`);
  if (doc.has("#Date")) {
    const currentDate = new Date();
    console.log(`The current date is: ${currentDate.toLocaleDateString()}`);
  }
} else {
  console.log("Sorry, I didn't understand your command.");
}
