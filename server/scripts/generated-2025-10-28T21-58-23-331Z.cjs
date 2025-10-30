const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function updateKnowledgeGraph(event) {
  const now = new Date().toISOString();
  const eventId = `${now} ${Math.random()}`;
  knowledgeGraph[eventId] = event;
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function getFromKnowledgeGraph(query) {
  return Object.values(knowledgeGraph).filter(event => event.includes(query)).slice(0, 5);
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
  const input = data.trim();
  if (input.startsWith('remember ')) {
    updateKnowledgeGraph(input.slice(9));
  } else if (input.startsWith('recall ')) {
    const query = input.slice(7);
    const results = getFromKnowledgeGraph(query);
    console.log(results.map((result, index) => `${index + 1}. ${result}`).join('\n'));
  }
});