const fs = require("fs");
const path = require("path");

let userInteractions = {};

function saveUserInteractions() {
  fs.writeFileSync(
    path.join(__dirname, "user_interactions.json"),
    JSON.stringify(userInteractions, null, 2)
  );
}

function loadUserInteractions() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "user_interactions.json"));
    userInteractions = JSON.parse(data);
  } catch (e) {}
}

loadUserInteractions();

process.stdin.on("data", (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  const response = `You said: ${userInput}`;
  console.log(response);

  userInteractions[userInput] = (userInteractions[userInput] || 0) + 1;
  saveUserInteractions();

  // TO DO: implement suggestion logic based on user interactions
});

process.stdin.setEncoding("utf8");
