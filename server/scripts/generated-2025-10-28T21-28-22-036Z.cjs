const fs = require('fs');
const jsonGraph = {};

function addNode(nodeId, nodeLabel) {
  if (!jsonGraph[nodeId]) {
    jsonGraph[nodeId] = { id: nodeId, label: nodeLabel, related: {} };
  }
}

function addRelationship(fromNodeId, toNodeId, relationshipType) {
  if (jsonGraph[fromNodeId] && jsonGraph[toNodeId]) {
    jsonGraph[fromNodeId].related[toNodeId] = relationshipType;
  }
}

addNode('concepts', 'Concepts');
addNode('knowledge_graph', 'Knowledge Graph');
addNode('relationships', 'Relationships');
addNode('topics', 'Topics');

addRelationship('concepts', 'knowledge_graph', 'part_of');
addRelationship('knowledge_graph', 'relationships', 'has');
addRelationship('topics', 'concepts', 'instance_of');

fs.writeFileSync('knowledge_graph.json', JSON.stringify(jsonGraph, null, 2));
console.log('Knowledge graph created and saved to knowledge_graph.json');