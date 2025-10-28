const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function storeConversation(conversation) {
  const timestamp = new Date().toISOString();
  knowledgeGraph[timestamp] = conversation;
  fs.writeFileSync(path.join(__dirname, 'knowledge_graph.json'), JSON.stringify(knowledgeGraph, null, 2));
}

function recallConversation(query) {
  for (const timestamp in knowledgeGraph) {
    if (Object.values(knowledgeGraph[timestamp]).some(value => value.includes(query))) {
      return knowledgeGraph[timestamp];
    }
  }
  return null;
}

storeConversation({ '2025-10-27T21:04:24.710Z': 'Implementing a context-aware knowledge graph...' });

console.log(recallConversation('knowledge graph'));