console.log("Context-Aware Knowledge Graph Roadmap Script");

const knowledgeGraph = {};

function addEntity(entity) {
  if (!knowledgeGraph[entity]) knowledgeGraph[entity] = {};
}

function addRelationship(entity1, entity2, relationship) {
  if (knowledgeGraph[entity1] && knowledgeGraph[entity2])
    knowledgeGraph[entity1][entity2] = relationship;
}

addEntity("User Requests");
addEntity("Topics");
addEntity("Entities");
addEntity("Tasks");

addRelationship("User Requests", "Topics", "relatedTo");
addRelationship("User Requests", "Entities", "mentions");
addRelationship("User Requests", "Tasks", "initiates");
addRelationship("Topics", "Entities", "involves");
addRelationship("Entities", "Tasks", "participatesIn");

console.log(knowledgeGraph);
