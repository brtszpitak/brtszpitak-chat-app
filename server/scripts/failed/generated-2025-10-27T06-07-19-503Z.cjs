const fs = require("fs");
let data = {};

try {
  data = JSON.parse(fs.readFileSync("feedback.json", "utf8"));
} catch (e) {}

console.log("Provide feedback for AI responses:");
console.log("1. Thumbs up (correct response)");
console.log("2. Thumbs down (incorrect response)");
console.log("3. Provide brief feedback");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Choose an option: ", (option) => {
  if (option === "1") {
    data.correct = (data.correct || 0) + 1;
  } else if (option === "2") {
    data.incorrect = (data.incorrect || 0) + 1;
  } else if (option === "3") {
    rl.question("Enter brief feedback: ", (feedback) => {
      data.feedback = data.feedback || [];
      data.feedback.push(feedback);
      fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
      console.log("Feedback saved!");
      rl.close();
    });
  } else {
    console.log("Invalid option. Try again.");
    rl.close();
  }

  fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));
  console.log(`Correct: ${data.correct || 0}, Incorrect: ${data.incorrect || 0}`);
  rl.close();
});
