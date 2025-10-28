const fs = require("fs");
const jsonGraph = {};

function addEntity(entity) {
  if (!jsonGraph[entity.type]) jsonGraph[entity.type] = {};
  jsonGraph[entity.type][entity.id] = entity;
}

function addRelationship(from, to, relation) {
  if (!jsonGraph[from.type][from.id].relations) jsonGraph[from.type][from.id].relations = {};
  jsonGraph[from.type][from.id].relations[to.id] = relation;
}

addEntity({ type: "concept", id: "knowledge-graph", name: "Knowledge Graph" });
addEntity({ type: "entity", id: "alice", name: "Alice" });
addEntity({ type: "entity", id: "bartosz", name: "Bartosz" });

addRelationship(
  { type: "entity", id: "alice" },
  { type: "concept", id: "knowledge-graph" },
  "uses"
);
addRelationship(
  { type: "entity", id: "bartosz" },
  { type: "concept", id: "knowledge-graph" },
  "created"
);

fs.writeFileSync("knowledge-graph.json", JSON.stringify(jsonGraph, null, 2));
console.log("Knowledge graph created and saved to knowledge-graph.json");
