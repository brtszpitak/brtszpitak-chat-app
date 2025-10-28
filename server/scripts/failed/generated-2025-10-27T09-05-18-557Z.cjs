const fs = require("fs");
const path = require("path");

let contextMemory = {};

if (fs.existsSync(path.join(__dirname, "context.json"))) {
  contextMemory = JSON.parse(fs.readFileSync(path.join(__dirname, "context.json"), "utf8"));
}

process.stdin.on("data", (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  if (!contextMemory[userInput]) {
    contextMemory[userInput] = {};
  }

  console.log(`You said: ${userInput}`);
  console.log(`Context memory for this conversation:`);
  console.log(JSON.stringify(contextMemory, null, 2));

  fs.writeFileSync(path.join(__dirname, "context.json"), JSON.stringify(contextMemory, null, 2));
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
