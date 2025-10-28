const fs = require("fs");
const moment = require("moment");

const knowledgeGraph = {};

function addConcept(concept) {
  if (!knowledgeGraph[concept]) {
    knowledgeGraph[concept] = { entities: {}, relationships: {} };
  }
}

function addEntity(concept, entity) {
  if (knowledgeGraph[concept]) {
    knowledgeGraph[concept].entities[entity] = true;
  }
}

function addRelationship(concept1, concept2, relationship) {
  if (knowledgeGraph[concept1] && knowledgeGraph[concept2]) {
    knowledgeGraph[concept1].relationships[concept2] = relationship;
    knowledgeGraph[concept2].relationships[concept1] = relationship;
  }
}

const roadmapEntry =
  "2025-10-27T10:39:59.068Z I suggest implementing a knowledge graph to store and connect concepts, entities, and relationships, allowing me to provide more accurate and informative responses. This would enable me to better understand context and make more insightful connections between topics.";
const entryDate = moment(roadmapEntry.split(" ")[0]).format("YYYY-MM-DD");
const concept = "Knowledge Graph";
addConcept(concept);
addEntity(concept, "Entities");
addEntity(concept, "Relationships");
addRelationship(concept, "Context", "UNDERSTANDS");
addRelationship(concept, "Insightful Connections", "ENABLES");

fs.writeFileSync(`knowledge-graph-${entryDate}.json`, JSON.stringify(knowledgeGraph, null, 2));
console.log(`Knowledge graph saved to knowledge-graph-${entryDate}.json`);
