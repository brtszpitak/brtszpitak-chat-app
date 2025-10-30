const fs = require('fs');
const moment = require('moment');

const knowledgeGraph = {};

const addConcept = (concept, topic) => {
  if (!knowledgeGraph[topic]) knowledgeGraph[topic] = [];
  knowledgeGraph[topic].push(concept);
};

const getRelatedConcepts = (concept) => {
  const relatedConcepts = {};
  for (const [topic, concepts] of Object.entries(knowledgeGraph)) {
    if (concepts.includes(concept)) {
      relatedConcepts[topic] = concepts.filter((c) => c !== concept);
    }
  }
  return relatedConcepts;
};

addConcept('Knowledge Graph', 'AI');
addConcept('Entity Disambiguation', 'NLP');
addConcept('Contextual Understanding', 'AI');

console.log(getRelatedConcepts('Knowledge Graph'));