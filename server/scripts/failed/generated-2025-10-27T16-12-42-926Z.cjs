const fs = require("fs");
let data = {};

try {
  data = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
} catch (e) {}

function saveData() {
  fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
}

function rateResponse(response, rating) {
  if (!data.responses) data.responses = {};
  if (!data.responses[response]) data.responses[response] = { ratings: [] };
  data.responses[response].ratings.push(rating);
  saveData();
}

function correctResponse(response, correction) {
  if (!data.corrections) data.corrections = {};
  if (!data.corrections[response]) data.corrections[response] = [];
  data.corrections[response].push(correction);
  saveData();
}

console.log("Enter response and rating (or correction):");
process.stdin.setEncoding("utf8");
process.stdin
  .on("data", (input) => {
    const [response, ...rest] = input.trim().split("\n");
    if (rest[0].startsWith("rating:")) rateResponse(response, parseInt(rest[0].substr(7)));
    else correctResponse(response, rest.join("\n"));
  })
  .on("end", () => process.exit());
