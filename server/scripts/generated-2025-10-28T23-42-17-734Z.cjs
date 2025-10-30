const fs = require('fs');
const { performance } = require('perf_hooks');

let kg = {};

function addConcept(concept) {
  if (!kg[concept]) kg[concept] = [];
}

function connectConcepts(concept1, concept2) {
  if (kg[concept1]) kg[concept1].push(concept2);
  if (kg[concept2]) kg[concept2].push(concept1);
}

function getRelatedConcepts(concept) {
  return kg[concept] || [];
}

let start = performance.now();
addConcept('Node.js');
addConcept('JavaScript');
addConcept('TypeScript');
connectConcepts('Node.js', 'JavaScript');
connectConcepts('JavaScript', 'TypeScript');
console.log(getRelatedConcepts('Node.js'));
console.log(`Execution time: ${performance.now() - start}ms`);
fs.writeFileSync('knowledge-graph.json', JSON.stringify(kg, null, 2));