const fs = require("fs");
const path = require("path");

let conversations = {};

if (fs.existsSync(path.join(__dirname, "conversations.json"))) {
  conversations = JSON.parse(fs.readFileSync(path.join(__dirname, "conversations.json"), "utf8"));
}

function saveConversations() {
  fs.writeFileSync(
    path.join(__dirname, "conversations.json"),
    JSON.stringify(conversations, null, 2)
  );
}

function recallConversation(id) {
  return conversations[id];
}

function storeConversation(id, conversation) {
  conversations[id] = conversation;
  saveConversations();
}

process.stdin.setEncoding("utf8");

let id = Date.now().toString();
storeConversation(id, []);

process.stdout.write(`Conversation ID: ${id}\n`);

process.stdin.on("data", (chunk) => {
  const message = chunk.trim();
  if (message !== "") {
    conversations[id].push(message);
    saveConversations();
    process.stdout.write(`You: ${message}\n`);
    // TO DO: implement natural language processing to identify relevant topics and follow-ups
    process.stdout.write(`AI: (no response yet)\n`);
  }
});
