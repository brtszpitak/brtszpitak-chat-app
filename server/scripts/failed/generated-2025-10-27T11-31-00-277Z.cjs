const fs = require("fs");
const path = require("path");
const nlp = require("compromise");

let conversationLog = {};

if (fs.existsSync(path.join(__dirname, "conversation-log.json"))) {
  conversationLog = JSON.parse(
    fs.readFileSync(path.join(__dirname, "conversation-log.json"), "utf8")
  );
}

function rememberConversation(conversation) {
  conversationLog[Date.now()] = conversation;
  fs.writeFileSync(path.join(__dirname, "conversation-log.json"), JSON.stringify(conversationLog));
}

function recallConversation() {
  const topics = {};
  Object.values(conversationLog).forEach((conversation) => {
    const doc = nlp(conversation);
    const entities = doc.entities().out("array");
    entities.forEach((entity) => {
      if (!topics[entity.text]) topics[entity.text] = 0;
      topics[entity.text]++;
    });
  });
  return topics;
}

const userQuery = process.argv[2];
rememberConversation(userQuery);
console.log(recallConversation());
