const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
} catch {}
const prompt = (q) => {
  process.stdout.write(q);
};
prompt("Please provide your rating (1-5) and/or feedback: ");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [rating, ...feedback] = input.trim().split(/\s+/);
  if (!isNaN(rating) && rating >= 1 && rating <= 5)
    data.ratings = (data.ratings || []).concat(Number(rating));
  if (feedback.length > 0) data.feedback = (data.feedback || []).concat(feedback.join(" "));
  fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
  console.log("Thank you for your feedback!");
  process.exit();
});
