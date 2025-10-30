const fs = require('fs');
let knowledgeGraph = {};

function addConcept(concept) {
  if (!knowledgeGraph[concept]) {
    knowledgeGraph[concept] = {};
  }
}

function connectConcepts(from, to) {
  if (knowledgeGraph[from] && knowledgeGraph[to]) {
    if (!knowledgeGraph[from].connectedTo) {
      knowledgeGraph[from].connectedTo = [];
    }
    knowledgeGraph[from].connectedTo.push(to);
  }
}

function recallConversation(concept) {
  if (knowledgeGraph[concept]) {
    return knowledgeGraph[concept];
  } else {
    return null;
  }
}

function saveKnowledgeGraph() {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync('knowledge-graph.json', 'utf8');
    knowledgeGraph = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

loadKnowledgeGraph();

// Example usage:
addConcept('context');
addConcept('accuracy');
connectConcepts('context', 'accuracy');
saveKnowledgeGraph();
console.log(recallConversation('context'));