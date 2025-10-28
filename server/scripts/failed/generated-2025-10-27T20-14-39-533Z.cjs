const fs = require("fs");
const path = require("path");

let feedbackData = {};

try {
  const filePath = path.join(__dirname, "feedback.json");
  if (fs.existsSync(filePath)) {
    feedbackData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
} catch (err) {
  console.error(err);
}

function rateResponse(responseId, rating) {
  if (!feedbackData[responseId]) feedbackData[responseId] = { ratings: [] };
  feedbackData[responseId].ratings.push(rating);
  saveFeedback();
}

function correctResponse(responseId, correction) {
  if (!feedbackData[responseId]) feedbackData[responseId] = { corrections: [] };
  feedbackData[responseId].corrections.push(correction);
  saveFeedback();
}

function saveFeedback() {
  const filePath = path.join(__dirname, "feedback.json");
  fs.writeFileSync(filePath, JSON.stringify(feedbackData, null, 2));
}

console.log(
  "Feedback system initialized. Use rateResponse(responseId, rating) or correctResponse(responseId, correction) to provide feedback."
);
