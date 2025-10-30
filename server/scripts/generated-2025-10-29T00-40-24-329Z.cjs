const fs = require('fs');

let knowledgeGraph = {};

function updateKnowledgeGraph(event) {
  const timestamp = new Date().toISOString();
  const eventType = Object.keys(event)[0];
  const eventData = event[eventType];

  if (!knowledgeGraph[timestamp]) knowledgeGraph[timestamp] = {};
  knowledgeGraph[timestamp][eventType] = eventData;
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  try {
    const event = JSON.parse(input);
    updateKnowledgeGraph(event);
  } catch (e) {
    console.error(`Error parsing input: ${e}`);
  }
});

process.on('SIGINT', () => {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
  process.exit();
});