const fs = require("fs");

let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

function recall(conversationId) {
  return memory[conversationId] || [];
}

function remember(conversationId, message) {
  if (!memory[conversationId]) {
    memory[conversationId] = [];
  }
  memory[conversationId].push(message);
  fs.writeFileSync("./memory.json", JSON.stringify(memory));
}

const conversationId = "test";
remember(conversationId, "Hello!");
remember(conversationId, "How are you?");
console.log(recall(conversationId));
