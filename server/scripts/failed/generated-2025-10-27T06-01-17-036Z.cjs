console.log("Implementing a knowledge graph...");

const knowledgeGraph = {};

function addEntity(entity, properties) {
  knowledgeGraph[entity] = properties;
}

function addRelationship(entity1, entity2, relationship) {
  if (!knowledgeGraph[entity1].relationships) {
    knowledgeGraph[entity1].relationships = {};
  }
  knowledgeGraph[entity1].relationships[entity2] = relationship;
}

addEntity("concepts", { type: "abstract" });
addEntity("entities", { type: "object" });
addEntity("relationships", { type: "connection" });

addRelationship("concepts", "entities", "has-instance");
addRelationship("entities", "relationships", "is-connected-by");

console.log(knowledgeGraph);
