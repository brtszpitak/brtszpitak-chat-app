const fs = require('fs');
const data = {};

function addConcept(name) {
  if (!data[name]) {
    data[name] = { entities: [], relationships: {} };
  }
}

function addEntity(concept, entity) {
  if (data[concept]) {
    data[concept].entities.push(entity);
  }
}

function addRelationship(concept1, concept2, relationship) {
  if (data[concept1] && data[concept2]) {
    data[concept1].relationships[concept2] = relationship;
    data[concept2].relationships[concept1] = relationship;
  }
}

function save() {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(data, null, 2));
}

addConcept('AI');
addEntity('AI', 'Assistant');
addRelationship('AI', 'Machine Learning', 'uses');

save();

console.log('Knowledge graph saved to knowledge-graph.json');