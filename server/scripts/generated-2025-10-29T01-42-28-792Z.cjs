const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const conversationKey = Object.keys(conversation)[0];
  const conversationValue = conversation[conversationKey];
  
  if (!knowledgeGraph[conversationKey]) {
    knowledgeGraph[conversationKey] = [];
  }
  
  knowledgeGraph[conversationKey].push(conversationValue);
}

function recallFromKnowledgeGraph(key) {
  return knowledgeGraph[key];
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  const conversation = JSON.parse(chunk.toString());
  updateKnowledgeGraph(conversation);
});

process.stdin.on('end', () => {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
});

console.log('Ready to learn!');