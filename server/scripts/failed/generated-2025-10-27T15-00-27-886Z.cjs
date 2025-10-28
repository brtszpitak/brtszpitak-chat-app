const fs = require("fs");
const jsonGraph = {};

function addNode(id, type, properties) {
  if (!jsonGraph.nodes) jsonGraph.nodes = {};
  jsonGraph.nodes[id] = { type, properties };
}

function addRelationship(from, to, type) {
  if (!jsonGraph.relationships) jsonGraph.relationships = [];
  jsonGraph.relationships.push({ from, to, type });
}

addNode("concept1", "Concept", { name: "AI" });
addNode("entity1", "Entity", { name: "Alice" });
addRelationship("concept1", "entity1", "RELATED_TO");

fs.writeFileSync("knowledge-graph.json", JSON.stringify(jsonGraph, null, 2));
console.log("Knowledge graph created and saved to knowledge-graph.json");
