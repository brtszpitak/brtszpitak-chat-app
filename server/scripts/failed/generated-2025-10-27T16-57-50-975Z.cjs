const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const conversationId = new Date().toISOString();
  knowledgeGraph[conversationId] = conversation;
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
}

function getConversationContext(conversationId) {
  return knowledgeGraph[conversationId];
}

function respondToUser(query, conversationId) {
  const context = getConversationContext(conversationId);
  // implement AI logic to generate response based on query and context
  console.log(`Response: ${query} + ${context}`);
}

const initialQuery = "Hello";
const initialConversationId = new Date().toISOString();
updateKnowledgeGraph({ query: initialQuery, responses: [] });
respondToUser(initialQuery, initialConversationId);

// simulate user interactions
setTimeout(() => {
  const followUpQuery = "How are you?";
  respondToUser(followUpQuery, initialConversationId);
}, 1000);
