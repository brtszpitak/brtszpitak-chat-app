const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const conversationId = Date.now();
  knowledgeGraph[conversationId] = conversation;
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function recallConversation(conversationId) {
  return knowledgeGraph[conversationId];
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const conversation = chunk.toString().trim();
  updateKnowledgeGraph(conversation);
  console.log(`Conversation saved with ID: ${Object.keys(knowledgeGraph).pop()}`);
});

console.log('Type a message to save it in the knowledge graph...');