const fs = require("fs");
const path = require("path");

let feedbackData = {};

if (fs.existsSync(path.join(__dirname, "feedback.json"))) {
  feedbackData = JSON.parse(fs.readFileSync(path.join(__dirname, "feedback.json"), "utf8"));
}

function saveFeedback() {
  fs.writeFileSync(path.join(__dirname, "feedback.json"), JSON.stringify(feedbackData, null, 2));
}

function rateResponse(response, rating) {
  if (!feedbackData[response]) feedbackData[response] = { ratings: [], corrections: [] };
  feedbackData[response].ratings.push(rating);
  saveFeedback();
}

function correctResponse(response, correction) {
  if (!feedbackData[response]) feedbackData[response] = { ratings: [], corrections: [] };
  feedbackData[response].corrections.push(correction);
  saveFeedback();
}

console.log(
  'Rate a response (e.g., rateResponse("response", 5)) or correct a response (e.g., correctResponse("response", "corrected response"))'
);
