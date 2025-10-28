const fs = require("fs");
const path = require("path");

let data = {};

if (fs.existsSync(path.join(__dirname, "feedback.json"))) {
  data = JSON.parse(fs.readFileSync(path.join(__dirname, "feedback.json"), "utf8"));
}

function rateResponse(response, rating) {
  if (!data[response]) data[response] = { ratings: [], corrections: [] };
  data[response].ratings.push(rating);
}

function correctResponse(response, correction) {
  if (!data[response]) data[response] = { ratings: [], corrections: [] };
  data[response].corrections.push(correction);
}

function saveFeedback() {
  fs.writeFileSync(path.join(__dirname, "feedback.json"), JSON.stringify(data));
}

function getAverageRating(response) {
  if (data[response] && data[response].ratings.length > 0) {
    return data[response].ratings.reduce((a, b) => a + b, 0) / data[response].ratings.length;
  }
  return null;
}

function getMostCommonCorrection(response) {
  if (data[response] && data[response].corrections.length > 0) {
    const corrections = {};
    for (const correction of data[response].corrections) {
      if (!corrections[correction]) corrections[correction] = 0;
      corrections[correction]++;
    }
    let mostCommonCorrection = null;
    let maxCount = 0;
    for (const correction in corrections) {
      if (corrections[correction] > maxCount) {
        maxCount = corrections[correction];
        mostCommonCorrection = correction;
      }
    }
    return mostCommonCorrection;
  }
  return null;
}

// Example usage:
rateResponse("Hello, how are you?", 5);
correctResponse("Hello, how are you?", "Hi, I'm fine.");
saveFeedback();

console.log(getAverageRating("Hello, how are you?"));
console.log(getMostCommonCorrection("Hello, how are you?"));
