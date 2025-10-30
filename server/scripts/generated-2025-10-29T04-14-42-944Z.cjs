const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

const conversationHistory = [];

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    conversationHistory.push(message);
    updateKnowledgeGraph(message);
  }
});

function updateKnowledgeGraph(message) {
  const words = message.split(' ');
  for (const word of words) {
    if (!knowledgeGraph[word]) {
      knowledgeGraph[word] = { count: 0, related: {} };
    }
    knowledgeGraph[word].count++;
    for (const otherWord of words) {
      if (otherWord !== word) {
        if (!knowledgeGraph[word].related[otherWord]) {
          knowledgeGraph[word].related[otherWord] = 0;
        }
        knowledgeGraph[word].related[otherWord]++;
      }
    }
  }
  saveKnowledgeGraph();
}

process.on('SIGINT', () => {
  console.log('Saving conversation history...');
  fs.writeFileSync(path.join(__dirname, 'conversation-history.txt'), conversationHistory.join('\n'));
  process.exit(0);
});