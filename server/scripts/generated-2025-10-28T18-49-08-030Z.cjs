const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledgeGraph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledgeGraph.json'), 'utf8'));
}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledgeGraph.json'), JSON.stringify(knowledgeGraph, null, 2));
}

function recallTopic(topic) {
  return knowledgeGraph[topic];
}

function remember(topic, information) {
  knowledgeGraph[topic] = information;
  saveKnowledgeGraph();
}

remember('introduction', 'Hello! I can retain information about our previous conversations and interactions.');

console.log(recallTopic('introduction'));