const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function updateKnowledgeGraph(topic, info) {
  if (!knowledgeGraph[topic]) knowledgeGraph[topic] = [];
  knowledgeGraph[topic].push(info);
}

function recallTopic(topic) {
  return knowledgeGraph[topic];
}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge_graph.json'), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledge_graph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const input = chunk.trim();
  if (input.startsWith('remember')) {
    const [_, topic, info] = input.split(' ');
    updateKnowledgeGraph(topic, info);
    saveKnowledgeGraph();
    console.log(`Remembered ${topic}: ${info}`);
  } else if (input.startsWith('recall')) {
    const [_, topic] = input.split(' ');
    const recalledInfo = recallTopic(topic);
    if (recalledInfo) console.log(recalledInfo.join(', '));
    else console.log(`No information about ${topic} found`);
  }
});