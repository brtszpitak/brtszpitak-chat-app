console.log("Initializing Knowledge Graph...");
const knowledgeGraph = {};
function addConcept(concept, description) {
  if (!knowledgeGraph[concept]) knowledgeGraph[concept] = { description, related: {} };
}
function relateConcepts(concept1, concept2, relation) {
  if (knowledgeGraph[concept1] && knowledgeGraph[concept2])
    knowledgeGraph[concept1].related[concept2] = relation;
}
addConcept("Node.js", "A JavaScript runtime built on Chrome's V8");
addConcept("Knowledge Graph", "A graph data model for storing and querying complex relationships");
relateConcepts("Node.js", "JavaScript", "built-on");
relateConcepts("Knowledge Graph", "AI", "used-in");
console.log(knowledgeGraph);
