const fs = require("fs");
let conversations = {};

if (fs.existsSync("conversations.json")) {
  conversations = JSON.parse(fs.readFileSync("conversations.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput === "") return;

  const conversationId = Math.random().toString(36).substr(2, 9);
  conversations[conversationId] = { inputs: [userInput], responses: [] };

  console.log(`Conversation ID: ${conversationId}`);

  process.stdout.write("You: ");
});

process.stdin.on("end", () => {
  fs.writeFileSync("conversations.json", JSON.stringify(conversations));
});
