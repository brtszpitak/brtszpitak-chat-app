const fs = require("fs");
const path = require("path");

let conversations = {};

if (fs.existsSync("conversations.json")) {
  conversations = JSON.parse(fs.readFileSync("conversations.json", "utf8"));
}

function saveConversation(label, conversation) {
  conversations[label] = conversation;
  fs.writeFileSync("conversations.json", JSON.stringify(conversations));
}

function recallConversation(label) {
  return conversations[label];
}

console.log("Available commands:");
console.log("  save <label> <conversation>");
console.log("  recall <label>");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, label, ...args] = input.trim().split(" ");
  if (command === "save") {
    saveConversation(label, args.join(" "));
    console.log(`Conversation saved as "${label}"`);
  } else if (command === "recall") {
    const conversation = recallConversation(label);
    if (conversation) {
      console.log(conversation);
    } else {
      console.log(`No conversation found with label "${label}"`);
    }
  }
});
