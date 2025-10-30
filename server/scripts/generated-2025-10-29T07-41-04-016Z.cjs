const fs = require('fs');
const data = {
  "concepts": {},
  "relationships": {}
};

function addConcept(name) {
  if (!data.concepts[name]) {
    data.concepts[name] = {};
  }
}

function relate(concept1, concept2, type) {
  if (data.concepts[concept1] && data.concepts[concept2]) {
    if (!data.relationships[concept1]) {
      data.relationships[concept1] = {};
    }
    data.relationships[concept1][concept2] = type;
  }
}

addConcept('knowledge graph');
addConcept('user queries');
relate('knowledge graph', 'user queries', 'related to');

fs.writeFileSync('knowledge-graph.json', JSON.stringify(data, null, 2));
console.log('Knowledge graph initialized.');