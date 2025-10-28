const fs = require("fs");
let data = {};

if (fs.existsSync("feedback.json")) {
  data = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
}

function rateResponse(response, rating) {
  if (!data[response]) data[response] = { ratings: [], corrections: [] };
  data[response].ratings.push(rating);
}

function correctResponse(response, correction) {
  if (!data[response]) data[response] = { ratings: [], corrections: [] };
  data[response].corrections.push(correction);
}

function getAverageRating(response) {
  if (data[response] && data[response].ratings.length > 0) {
    return data[response].ratings.reduce((a, b) => a + b, 0) / data[response].ratings.length;
  }
  return null;
}

function getMostCommonCorrection(response) {
  if (data[response] && data[response].corrections.length > 0) {
    let counts = {};
    for (let correction of data[response].corrections) {
      counts[correction] = (counts[correction] || 0) + 1;
    }
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }
  return null;
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, response, value] = input.trim().split(" ");
  if (command === "rate") rateResponse(response, parseInt(value));
  else if (command === "correct") correctResponse(response, value);
  process.stdout.write(`Rated ${response} with ${value}\n`);
});

process.on("exit", () => {
  fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
});
