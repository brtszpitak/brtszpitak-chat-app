console.log("Initializing knowledge graph...");

const graph = {};

function addConcept(concept, description) {
  graph[concept] = { description, related: {} };
}

function relateConcepts(concept1, concept2) {
  if (graph[concept1] && graph[concept2]) {
    graph[concept1].related[concept2] = true;
    graph[concept2].related[concept1] = true;
  }
}

function recallConcept(concept) {
  return graph[concept];
}

addConcept("knowledge graph", "A data structure to store and connect concepts");
addConcept("collaboration", "Working together with a sense of continuity and shared understanding");
relateConcepts("knowledge graph", "collaboration");

console.log(recallConcept("knowledge graph"));
