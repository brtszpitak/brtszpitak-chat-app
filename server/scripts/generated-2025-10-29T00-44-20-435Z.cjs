const fs = require('fs');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    knowledgeGraph = JSON.parse(fs.readFileSync('knowledge-graph.json', 'utf8'));
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const conversation = input.trim();
  if (conversation !== '') {
    console.log(`You said: ${conversation}`);
    knowledgeGraph[conversation] = knowledgeGraph[conversation] || { responses: [] };
    const response = `I remember you said that before!`;
    knowledgeGraph[conversation].responses.push(response);
    console.log(response);
    saveKnowledgeGraph();
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!');
});