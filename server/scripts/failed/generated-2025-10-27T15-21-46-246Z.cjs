const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class Node {
  constructor(type, name) {
    this.id = uuidv4();
    this.type = type;
    this.name = name;
    this.relationships = {};
  }
}

class KnowledgeGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes[node.id] = node;
  }

  addRelationship(from, to, type) {
    if (!this.nodes[from] || !this.nodes[to]) return;
    this.nodes[from].relationships[to] = type;
    this.nodes[to].relationships[from] = `inverse-${type}`;
  }

  query(nodeId, depth = 1) {
    const result = {};
    const queue = [{ node: this.nodes[nodeId], distance: 0 }];
    while (queue.length > 0) {
      const { node, distance } = queue.shift();
      if (!result[node.id]) result[node.id] = node;
      if (distance < depth) {
        Object.keys(node.relationships).forEach((id) => {
          queue.push({ node: this.nodes[id], distance: distance + 1 });
        });
      }
    }
    return result;
  }
}

const kg = new KnowledgeGraph();
kg.addNode(new Node("concept", "AI"));
kg.addNode(new Node("concept", "Node.js"));
kg.addNode(new Node("entity", "Alice"));
kg.addRelationship(
  kg.nodes[Object.keys(kg.nodes)[0]].id,
  kg.nodes[Object.keys(kg.nodes)[1]].id,
  "related-to"
);
kg.addRelationship(
  kg.nodes[Object.keys(kg.nodes)[2]].id,
  kg.nodes[Object.keys(kg.nodes)[0]].id,
  "knows-about"
);

console.log(kg.query(Object.keys(kg.nodes)[0]));
