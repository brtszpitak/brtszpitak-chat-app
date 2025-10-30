const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledge-graph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8'));
}

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  const context = getContext(userInput);
  updateKnowledgeGraph(context);

  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));

  console.log(`Updated knowledge graph:`);
  console.log(knowledgeGraph);
});

function getContext(input) {
  // TO DO: implement context detection logic
  return { topic: 'general', preferences: [] };
}

function updateKnowledgeGraph(context) {
  if (!knowledgeGraph[context.topic]) knowledgeGraph[context.topic] = {};
  Object.assign(knowledgeGraph[context.topic], context.preferences);
}