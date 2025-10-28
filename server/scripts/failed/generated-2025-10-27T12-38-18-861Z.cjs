fs = require("fs");
const { v4: uuidv4 } = require("uuid");

let conversations = {};

if (fs.existsSync("./conversations.json")) {
  conversations = JSON.parse(fs.readFileSync("./conversations.json", "utf8"));
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const conversationId = uuidv4();
  const message = input.trim();
  if (!message) return;

  if (!conversations[conversationId]) conversations[conversationId] = [];
  conversations[conversationId].push({ timestamp: new Date().toISOString(), message });

  fs.writeFileSync("./conversations.json", JSON.stringify(conversations, null, 2));

  console.log(`Conversation ID: ${conversationId}`);
});

process.on("exit", () => {
  fs.writeFileSync("./conversations.json", JSON.stringify(conversations, null, 2));
});
