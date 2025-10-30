const fs = require('fs');
const path = require('path');

class Node {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.related = {};
  }

  relate(node, type) {
    this.related[node.id] = { node, type };
  }
}

class KnowledgeGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(id, label) {
    if (!this.nodes[id]) {
      this.nodes[id] = new Node(id, label);
    }
    return this.nodes[id];
  }

  relateNodes(node1Id, node2Id, type) {
    const node1 = this.addNode(node1Id, '');
    const node2 = this.addNode(node2Id, '');
    node1.relate(node2, type);
    node2.relate(node1, type);
  }

  toJSON() {
    return JSON.stringify(this.nodes, null, 2);
  }
}

const graph = new KnowledgeGraph();

graph.relateNodes('user-intent', 'conversation-history', 'related-to');
graph.relateNodes('conversation-history', 'topic-relationships', 'part-of');
graph.relateNodes('topic-relationships', 'concepts', 'connected-to');

fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), graph.toJSON());

console.log('Knowledge graph created and saved to knowledge-graph.json');