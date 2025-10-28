const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
} catch {}
process.stdin.setEncoding("utf8");
console.log('Enter your query or "exit" to quit:');
process.stdin.on("data", (query) => {
  if (query.trim() === "exit") process.exit();
  const response = "Mock AI response for now...";
  console.log(response);
  console.log("Did I get it right? (y/n)");
  process.stdin.once("data", (answer) => {
    answer = answer.trim().toLowerCase();
    if (answer === "y" || answer === "n") {
      const queryTrimmed = query.trim();
      if (!data[queryTrimmed]) data[queryTrimmed] = { correct: 0, incorrect: 0 };
      if (answer === "y") data[queryTrimmed].correct++;
      else data[queryTrimmed].incorrect++;
      fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
    } else console.log('Invalid answer. Please respond with "y" or "n".');
    console.log('Enter your query or "exit" to quit:');
  });
});
