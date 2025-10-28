const fs = require("fs");
const moment = require("moment");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(node) {
    this.graph[node.id] = node;
  }

  addRelationship(from, to, type) {
    if (!this.graph[from]) throw new Error(`Node ${from} does not exist`);
    if (!this.graph[to]) throw new Error(`Node ${to} does not exist`);
    if (!this.graph[from].relationships) this.graph[from].relationships = {};
    this.graph[from].relationships[to] = type;
  }

  getNode(id) {
    return this.graph[id];
  }

  getRelatedNodes(id, type) {
    const node = this.getNode(id);
    if (!node || !node.relationships) return [];
    return Object.entries(node.relationships)
      .filter(([_, relType]) => relType === type)
      .map(([relatedNodeId]) => this.getNode(relatedNodeId));
  }
}

const kg = new KnowledgeGraph();

kg.addNode({ id: "concepts", label: "Concepts" });
kg.addNode({ id: "entities", label: "Entities" });
kg.addNode({ id: "relationships", label: "Relationships" });

kg.addRelationship("concepts", "entities", "HAS_ENTITY");
kg.addRelationship("entities", "relationships", "HAS_RELATIONSHIP");

fs.writeFileSync("knowledge-graph.json", JSON.stringify(kg.graph, null, 2));

console.log(`Knowledge graph created on ${moment().format()} and saved to knowledge-graph.json`);
