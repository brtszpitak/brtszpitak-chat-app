const fs = require("fs");
const readline = require("readline");

let conversationHistory = {};

if (fs.existsSync("conversationHistory.json")) {
  conversationHistory = JSON.parse(fs.readFileSync("conversationHistory.json", "utf8"));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What would you like to talk about? ", (answer) => {
  const userId = "default"; // Replace with actual user ID
  const conversationId = new Date().toISOString();

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = {};
  }

  conversationHistory[userId][conversationId] = answer;

  fs.writeFileSync("conversationHistory.json", JSON.stringify(conversationHistory, null, 2));

  console.log(`You said: ${answer}`);
  rl.close();
});

rl.on("close", () => {
  process.exit(0);
});
