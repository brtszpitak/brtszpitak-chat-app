const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync("memory.json", JSON.stringify(memory));
}

function recall(key) {
  return memory[key];
}

const conversationHistory = {};

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (!conversationHistory[message]) {
    conversationHistory[message] = {};
  }
  console.log(`You said: ${message}`);
  const response = recall(message);
  if (response) {
    console.log(`I remember: ${response}`);
  } else {
    console.log("I don't remember that. What would you like to store?");
    process.stdin.once("data", (answer) => {
      remember(message, answer.toString().trim());
      console.log("Stored!");
    });
  }
});
