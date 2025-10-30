const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledgeGraph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledgeGraph.json'), 'utf8'));
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  const now = new Date().toISOString();
  knowledgeGraph[now] = { input: userInput };

  fs.writeFileSync(path.join(__dirname, 'knowledgeGraph.json'), JSON.stringify(knowledgeGraph));

  console.log(`Stored input in knowledge graph: ${userInput}`);
});

process.stdin.on('end', () => {
  process.exit(0);
});