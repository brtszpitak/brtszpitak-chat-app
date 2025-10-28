const fs = require("fs");
let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

const storeConversation = (conversation) => {
  memory[Date.now()] = conversation;
  fs.writeFileSync("./memory.json", JSON.stringify(memory, null, 2));
};

const recallConversation = (query) => {
  for (let key in memory) {
    if (Object.prototype.hasOwnProperty.call(memory, key)) {
      const conversation = memory[key];
      if (conversation.includes(query)) {
        return conversation;
      }
    }
  }
  return null;
};

storeConversation("Hello! How can I assist you today?");

console.log(recallConversation("assist"));
