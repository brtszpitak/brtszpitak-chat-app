const fs = require("fs");
let feedbackData = {};

if (fs.existsSync("feedback.json")) {
  feedbackData = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
}

function saveFeedback() {
  fs.writeFileSync("feedback.json", JSON.stringify(feedbackData, null, 2));
}

function correctResponse(responseId, correction) {
  if (!feedbackData.responses) feedbackData.responses = {};
  feedbackData.responses[responseId] = correction;
  saveFeedback();
}

function rateResponse(responseId, rating) {
  if (!feedbackData.ratings) feedbackData.ratings = {};
  feedbackData.ratings[responseId] = rating;
  saveFeedback();
}

console.log("Usage:");
console.log("correctResponse(<responseId>, <correction>)");
console.log("rateResponse(<responseId>, <rating>)");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(/\s+/);
  if (command === "correctResponse") correctResponse(...args);
  else if (command === "rateResponse") rateResponse(...args);
});
