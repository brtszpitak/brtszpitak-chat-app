const fs = require("fs");
const path = require("path");

let feedbackLog = [];

if (fs.existsSync(path.join(__dirname, "feedback.log"))) {
  const data = fs.readFileSync(path.join(__dirname, "feedback.log"), "utf8");
  feedbackLog = JSON.parse(data);
}

function learnFromFeedback(feedback) {
  feedbackLog.push(feedback);
  fs.writeFileSync(path.join(__dirname, "feedback.log"), JSON.stringify(feedbackLog));
}

learnFromFeedback({
  timestamp: new Date().toISOString(),
  suggestion: "Implement a feature to learn from user feedback",
});

console.log("Initial feedback logged.");
