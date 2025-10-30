const fs = require('fs');
const graph = {};

function addNode(id, data) {
  graph[id] = { ...data, connections: {} };
}

function connectNodes(from, to, relation) {
  if (!graph[from] || !graph[to]) throw new Error(`Node not found`);
  graph[from].connections[to] = relation;
  graph[to].connections[from] = `inverse ${relation}`;
}

function queryGraph(query) {
  const results = {};
  function traverse(nodeId, depth = 0) {
    if (depth > 5) return; // prevent infinite loops
    const node = graph[nodeId];
    if (!node) return;
    if (query(node)) results[nodeId] = node;
    Object.keys(node.connections).forEach((connectedNodeId) => traverse(connectedNodeId, depth + 1));
  }
  traverse('root'); // assuming a 'root' node exists
  return results;
}

addNode('root', { topic: 'knowledge graph' });
addNode('node1', { topic: 'artificial intelligence' });
addNode('node2', { topic: 'natural language processing' });
connectNodes('root', 'node1', 'related to');
connectNodes('node1', 'node2', 'uses');

const result = queryGraph((node) => node.topic.includes('language'));
console.log(result);