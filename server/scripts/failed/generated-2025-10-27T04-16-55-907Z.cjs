const fs = require("fs");
const path = require("path");

let conversations = {};

function saveConversation(label, conversation) {
  conversations[label] = conversation;
  fs.writeFileSync(path.join(__dirname, "conversations.json"), JSON.stringify(conversations));
}

function loadConversations() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "conversations.json"));
    conversations = JSON.parse(data);
  } catch (e) {}
}

loadConversations();

console.log(
  'Type "save <label>" to save the current conversation, or "recall <label>" to recall a previous conversation.'
);

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(/\s+/);
  if (command === "save") {
    const label = args.join(" ");
    saveConversation(label, [...arguments].slice(1).join(" ").trim());
    console.log(`Conversation saved as "${label}"`);
  } else if (command === "recall") {
    const label = args.join(" ");
    if (conversations[label]) {
      console.log(conversations[label]);
    } else {
      console.log(`No conversation found with label "${label}"`);
    }
  } else {
    console.log(
      'Unknown command. Type "save <label>" to save the current conversation, or "recall <label>" to recall a previous conversation.'
    );
  }
});
