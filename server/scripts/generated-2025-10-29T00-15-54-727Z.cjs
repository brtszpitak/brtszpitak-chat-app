const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput) {
    const now = new Date().toISOString();
    knowledgeGraph[now] = userInput;
    saveKnowledgeGraph();
    console.log(`Thank you for your input!`);
  }
});

console.log(`Type something to add it to the knowledge graph...`);