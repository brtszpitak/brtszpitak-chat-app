const fs = require('fs');
const jsonGraph = {};

function addConcept(concept) {
  if (!jsonGraph[concept]) jsonGraph[concept] = {};
}

function connectConcepts(concept1, concept2) {
  if (jsonGraph[concept1] && jsonGraph[concept2]) {
    jsonGraph[concept1][concept2] = true;
    jsonGraph[concept2][concept1] = true;
  }
}

function recallConversation() {
  console.log(jsonGraph);
}

addConcept('knowledge graph');
addConcept('context awareness');
addConcept('accurate responses');

connectConcepts('knowledge graph', 'context awareness');
connectConcepts('knowledge graph', 'accurate responses');
connectConcepts('context awareness', 'accurate responses');

recallConversation();