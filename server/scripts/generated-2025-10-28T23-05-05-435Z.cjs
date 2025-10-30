const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledge-graph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8'));
}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function updateNode(nodeId, updates) {
  if (!knowledgeGraph[nodeId]) knowledgeGraph[nodeId] = {};
  Object.assign(knowledgeGraph[nodeId], updates);
  saveKnowledgeGraph();
}

function getNode(nodeId) {
  return knowledgeGraph[nodeId];
}

function addEdge(fromNodeId, toNodeId, relation) {
  if (!knowledgeGraph[fromNodeId].edges) knowledgeGraph[fromNodeId].edges = [];
  knowledgeGraph[fromNodeId].edges.push({ to: toNodeId, relation });
  saveKnowledgeGraph();
}

function getRelatedNodes(nodeId, relation) {
  const node = getNode(nodeId);
  return node && node.edges ? node.edges.filter(edge => edge.relation === relation).map(edge => edge.to) : [];
}

// Example usage:
updateNode('user-intent', { description: 'Understand user intent' });
updateNode('personalized-responses', { description: 'Provide personalized responses' });
addEdge('user-intent', 'personalized-responses', 'enables');
console.log(getRelatedNodes('user-intent', 'enables')); // Output: [ 'personalized-responses' ]