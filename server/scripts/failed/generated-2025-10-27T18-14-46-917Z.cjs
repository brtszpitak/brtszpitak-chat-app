const fs = require("fs");
const path = require("path");

let feedbackData = {};

if (fs.existsSync(path.join(__dirname, "feedback.json"))) {
  feedbackData = JSON.parse(fs.readFileSync(path.join(__dirname, "feedback.json"), "utf8"));
}

function storeFeedback(correction, rating) {
  const timestamp = new Date().toISOString();
  feedbackData[timestamp] = { correction, rating };
  fs.writeFileSync(path.join(__dirname, "feedback.json"), JSON.stringify(feedbackData, null, 2));
}

function getFeedback() {
  return feedbackData;
}

console.log("Welcome! Provide your feedback to help me improve:");
console.log(
  'Enter "correction" and then "rating" (1-5) separated by a space, or type "quit" to exit.'
);

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(" ");
  if (command === "quit") process.exit(0);
  else if (args.length === 2) storeFeedback(args[0], parseInt(args[1]));
  console.log('Enter next feedback or type "quit" to exit:');
});
