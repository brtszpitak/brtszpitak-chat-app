const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-graph.json')).toString());
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userQuery = input.trim();
  if (!userQuery) return;

  // Simple context-aware response
  if (knowledgeGraph[userQuery]) {
    console.log(knowledgeGraph[userQuery]);
  } else {
    console.log('I didn\'t understand that. Please provide more context or information.');
    knowledgeGraph[userQuery] = '';
  }

  const response = promptUserForMoreInfo(userQuery);
  if (response) {
    knowledgeGraph[userQuery] = response;
    saveKnowledgeGraph();
  }
});

function promptUserForMoreInfo(query) {
  console.log(`Can you provide more context or information about ${query}?`);
  return new Promise((resolve) => {
    process.stdin.once('data', (input) => {
      resolve(input.trim());
    });
  });
}