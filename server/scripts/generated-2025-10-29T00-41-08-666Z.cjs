const fs = require('fs');
let knowledgeGraph = {};

function updateKnowledgeGraph(event) {
  const timestamp = new Date().toISOString();
  knowledgeGraph[timestamp] = event;
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const event = chunk.toString().trim();
  if (event !== '') updateKnowledgeGraph(event);
});

console.log('Type your message to update the knowledge graph. Press Ctrl+C to exit.');