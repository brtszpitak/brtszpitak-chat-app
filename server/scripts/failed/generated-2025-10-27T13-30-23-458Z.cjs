const fs = require("fs");
const readline = require("readline");

let conversationHistory = [];
let suggestionSystem = {};

fs.readFile("conversationLog.txt", "utf8", (err, data) => {
  if (!err) conversationHistory = data.split("\n").filter(Boolean);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (input) => {
  const topic = input.trim().toLowerCase();
  conversationHistory.push(topic);

  fs.writeFile("conversationLog.txt", conversationHistory.join("\n"), (err) => {
    if (err) console.error(err);
  });

  Object.keys(suggestionSystem).forEach((key) => {
    if (topic.includes(key)) {
      console.log(`PowerShell suggestion: ${suggestionSystem[key]}`);
    }
  });

  rl.prompt();
}).on("close", () => process.exit(0));
