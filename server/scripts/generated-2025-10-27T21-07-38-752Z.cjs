const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
}

function loadGraph() {
  try {
    const graphData = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'));
    knowledgeGraph = JSON.parse(graphData);
  } catch (e) {}
}

loadGraph();

function addNode(conversationId, nodeId, data) {
  if (!knowledgeGraph[conversationId]) knowledgeGraph[conversationId] = {};
  knowledgeGraph[conversationId][nodeId] = data;
  saveGraph();
}

function getNode(conversationId, nodeId) {
  return knowledgeGraph[conversationId] ? knowledgeGraph[conversationId][nodeId] : null;
}

function connectNodes(conversationId, fromNodeId, toNodeId) {
  if (knowledgeGraph[conversationId] && knowledgeGraph[conversationId][fromNodeId]) {
    knowledgeGraph[conversationId][fromNodeId].connectedTo = toNodeId;
    saveGraph();
  }
}

// Example usage:
addNode('conv-1', 'node-1', { text: 'Hello' });
addNode('conv-1', 'node-2', { text: 'World' });
connectNodes('conv-1', 'node-1', 'node-2');
console.log(getNode('conv-1', 'node-1'));