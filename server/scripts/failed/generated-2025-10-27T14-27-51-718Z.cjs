const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("./feedback.json", "utf8"));
} catch (e) {}
process.stdin.setEncoding("utf8");
console.log("Enter your feedback (rating or correction):");
process.stdin.on("data", (input) => {
  const timestamp = new Date().toISOString();
  data[timestamp] = input.toString().trim();
  fs.writeFileSync("./feedback.json", JSON.stringify(data, null, 2));
  console.log("Feedback recorded. Thank you!");
  process.exit(0);
});
