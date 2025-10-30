const fs = require('fs');
const data = {
  "concepts": {},
  "entities": {},
  "relationships": {}
};

function addConcept(name, description) {
  data.concepts[name] = { description };
}

function addEntity(name, type) {
  data.entities[name] = { type };
}

function addRelationship(concept, entity, type) {
  if (!data.relationships[concept]) data.relationships[concept] = {};
  data.relationships[concept][entity] = type;
}

addConcept("Knowledge Graph", "A graph storing concepts, entities, and relationships");
addEntity("Node.js", "Programming Language");
addRelationship("Knowledge Graph", "Node.js", "Implemented In");

fs.writeFileSync('knowledge-graph.json', JSON.stringify(data, null, 2));

console.log("Knowledge Graph initialized. Data saved to knowledge-graph.json");