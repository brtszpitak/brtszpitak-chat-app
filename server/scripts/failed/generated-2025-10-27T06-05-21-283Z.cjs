const fs = require("fs");
let data = {};

try {
  data = JSON.parse(fs.readFileSync("./feedback.json", "utf8"));
} catch (e) {}

const responses = ["This is response 1", "This is response 2", "This is response 3"];

for (let i = 0; i < responses.length; i++) {
  console.log(`Response ${i + 1}: ${responses[i]}`);
  let rating;
  while (!["+", "-"].includes(rating)) {
    rating = prompt(`Please rate this response (+ or -): `);
  }
  if (!data[responses[i]]) data[responses[i]] = { positive: 0, negative: 0 };
  rating === "+" ? data[responses[i]].positive++ : data[responses[i]].negative++;
}

fs.writeFileSync("./feedback.json", JSON.stringify(data, null, 2));

console.log("Feedback saved!");
