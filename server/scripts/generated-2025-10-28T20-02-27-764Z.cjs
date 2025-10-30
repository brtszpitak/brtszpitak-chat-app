console.log('Alice Knowledge Graph Initialization');

const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

const saveKnowledgeGraph = () => {
  fs.writeFileSync(path.join(__dirname, 'knowledgeGraph.json'), JSON.stringify(knowledgeGraph));
};

const loadKnowledgeGraph = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledgeGraph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
};

loadKnowledgeGraph();

const storeContextInfo = (contextId, info) => {
  if (!knowledgeGraph[contextId]) knowledgeGraph[contextId] = {};
  Object.assign(knowledgeGraph[contextId], info);
  saveKnowledgeGraph();
};

const recallContextInfo = (contextId) => {
  return knowledgeGraph[contextId] || {};
};

// Example usage:
storeContextInfo('user1', { name: 'John Doe', interests: ['AI', 'Node.js'] });
console.log(recallContextInfo('user1'));