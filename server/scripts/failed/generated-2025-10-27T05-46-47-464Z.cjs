const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const conversationId = Date.now().toString();
  knowledgeGraph[conversationId] = conversation;
  fs.writeFileSync(
    path.join(__dirname, "knowledge-graph.json"),
    JSON.stringify(knowledgeGraph, null, 2)
  );
}

function recallConversation(conversationId) {
  return knowledgeGraph[conversationId];
}

function adaptToPreferences(preferences) {
  // TO DO: implement adaptation logic
  console.log("Adapting to preferences:", preferences);
}

let conversation = {
  date: new Date().toISOString(),
  message: "Hello, how can I assist you?",
  preferences: {},
};

updateKnowledgeGraph(conversation);

console.log("Initial knowledge graph:", knowledgeGraph);
