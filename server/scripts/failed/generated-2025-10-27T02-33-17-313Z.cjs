const fs = require("fs");
let data = {};

try {
  data = JSON.parse(fs.readFileSync("./feedback.json", "utf8"));
} catch (e) {}

function saveFeedback() {
  fs.writeFileSync("./feedback.json", JSON.stringify(data, null, 2));
}

function rateResponse(response, rating) {
  if (!data.responses) data.responses = {};
  if (!data.responses[response]) data.responses[response] = { ratings: [], corrections: [] };
  data.responses[response].ratings.push(rating);
  saveFeedback();
}

function correctResponse(response, correction) {
  if (!data.responses) data.responses = {};
  if (!data.responses[response]) data.responses[response] = { ratings: [], corrections: [] };
  data.responses[response].corrections.push(correction);
  saveFeedback();
}

console.log(
  'Enter "rate <response> <rating>" to rate a response, or "correct <response> <correction>" to correct a response.'
);
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, response, ...args] = input.trim().split(" ");
  if (command === "rate") rateResponse(response, args[0]);
  else if (command === "correct") correctResponse(response, args.join(" "));
  console.log("Feedback saved.");
});
