const fs = require("fs");

let feedbackData = {};

try {
  feedbackData = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
} catch (e) {}

function saveFeedback() {
  fs.writeFileSync("feedback.json", JSON.stringify(feedbackData, null, 2));
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

console.log("Enter response ID and your rating (1-5) or correction:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [id, ratingOrCorrection] = input.trim().split(" ");
  if (!isNaN(parseInt(ratingOrCorrection))) rateResponse(id, parseInt(ratingOrCorrection));
  else correctResponse(id, ratingOrCorrection);
});
