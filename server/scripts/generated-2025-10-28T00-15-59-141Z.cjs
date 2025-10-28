console.log('Implementing a context-aware knowledge graph is a complex task that requires extensive development and integration with various AI models. However, I can provide a basic script to get you started.');

const entities = ['user', 'request', 'response', 'entity', 'concept', 'task'];
const relationships = [
  { from: 'user', to: 'request' },
  { from: 'request', to: 'response' },
  { from: 'entity', to: 'concept' },
  { from: 'concept', to: 'task' },
];

console.log('Entities:', entities);
console.log('Relationships:', relationships);

function addEntity(entity) {
  entities.push(entity);
}

function addRelationship(from, to) {
  relationships.push({ from, to });
}

addEntity('collaboration');
addRelationship('user', 'collaboration');

console.log('Updated Entities:', entities);
console.log('Updated Relationships:', relationships);