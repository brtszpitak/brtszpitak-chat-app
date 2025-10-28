console.log("Knowledge Graph Implementation");

const knowledgeGraph = {};

function addConcept(concept) {
  if (!knowledgeGraph[concept]) {
    knowledgeGraph[concept] = { related: [] };
  }
}

function relateConcepts(concept1, concept2) {
  if (knowledgeGraph[concept1] && knowledgeGraph[concept2]) {
    knowledgeGraph[concept1].related.push(concept2);
    knowledgeGraph[concept2].related.push(concept1);
  }
}

addConcept("Node.js");
addConcept("Knowledge Graph");
addConcept("Conversation History");

relateConcepts("Node.js", "JavaScript");
relateConcepts("Knowledge Graph", "Artificial Intelligence");
relateConcepts("Conversation History", "Contextual Responses");

console.log(knowledgeGraph);
