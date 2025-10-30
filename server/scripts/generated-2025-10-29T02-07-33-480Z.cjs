const fs = require('fs');
const moment = require('moment');

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const timestamp = moment().format();
  knowledgeGraph[timestamp] = conversation;
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
}

updateKnowledgeGraph({ suggestion: 'Implement a context-aware knowledge graph' });

console.log('Initial knowledge graph updated.');