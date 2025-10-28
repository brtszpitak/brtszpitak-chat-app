const fs = require("fs");
const path = require("path");

let data = {};

try {
  const filePath = path.join(__dirname, "feedback.json");
  data = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (e) {}

function saveFeedback() {
  const filePath = path.join(__dirname, "feedback.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function processUserInput(input) {
  // TO DO: implement AI response generation
  console.log("AI Response:", input);
  return input;
}

function learnFromFeedback(userInput, correctResponse) {
  if (!data[userInput]) data[userInput] = [];
  data[userInput].push(correctResponse);
  saveFeedback();
}

const userInput = process.argv[2];
const correctResponse = process.argv[3];

if (userInput && correctResponse) {
  learnFromFeedback(userInput, correctResponse);
} else {
  console.log("Usage: node script.cjs <user_input> <correct_response>");
}
