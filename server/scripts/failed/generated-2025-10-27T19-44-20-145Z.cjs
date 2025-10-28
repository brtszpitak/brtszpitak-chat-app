const fs = require("fs");
const ratings = {};

process.stdin.setEncoding("utf8");

console.log('Provide your feedback (rating: 1-5, or "correct:" to correct response)');

process.stdin.on("data", (data) => {
  const [command, value] = data.trim().split(":");
  if (command === "rating") {
    const rating = parseInt(value);
    if (rating >= 1 && rating <= 5) ratings[rating] = (ratings[rating] || 0) + 1;
  } else if (command === "correct") {
    console.log(`Corrected response: ${value}`);
    // todo: implement correction storage and retrieval
  }
  console.log('Provide your feedback (rating: 1-5, or "correct:" to correct response)');
});

process.on("SIGINT", () => {
  fs.writeFileSync("ratings.json", JSON.stringify(ratings));
  console.log("Ratings saved to ratings.json");
  process.exit();
});
