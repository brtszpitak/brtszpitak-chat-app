const fs = require("fs");
const readline = require("readline");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addEntity(entity) {
    if (!this.graph[entity]) {
      this.graph[entity] = { relationships: {} };
    }
  }

  addRelationship(entity1, entity2, relationshipType) {
    if (this.graph[entity1] && this.graph[entity2]) {
      this.graph[entity1].relationships[entity2] = relationshipType;
      this.graph[entity2].relationships[entity1] = relationshipType;
    }
  }

  getRelatedEntities(entity) {
    return this.graph[entity] ? Object.keys(this.graph[entity].relationships) : [];
  }
}

const kg = new KnowledgeGraph();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("KG> ");
rl.prompt();

rl.on("line", (line) => {
  const [command, ...args] = line.trim().split(" ");
  switch (command) {
    case "add":
      kg.addEntity(args[0]);
      break;
    case "relate":
      kg.addRelationship(args[0], args[1], args[2]);
      break;
    case "related":
      console.log(kg.getRelatedEntities(args[0]));
      break;
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
