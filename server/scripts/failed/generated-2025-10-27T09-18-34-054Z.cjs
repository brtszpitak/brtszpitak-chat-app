const fs = require("fs");
let graph = {};

function addConcept(concept, connections) {
  if (!graph[concept]) graph[concept] = { connections: {} };
  for (const connection in connections)
    graph[concept].connections[connection] = connections[connection];
}

function recallConcept(concept) {
  return graph[concept] || null;
}

function buildUponConcept(concept, newConnections) {
  if (!graph[concept]) console.error(`Unknown concept: ${concept}`);
  else
    for (const connection in newConnections)
      graph[concept].connections[connection] = newConnections[connection];
}

addConcept("knowledge graph", { "store concepts": true, "connect concepts": true });
addConcept("concepts", { "recall conversations": true, "build upon responses": true });
addConcept("collaboration", { "foster continuity": true, "shared understanding": true });

console.log(recallConcept("knowledge graph"));
console.log(buildUponConcept("concepts", { "enable informed responses": true }));
console.log(graph);
