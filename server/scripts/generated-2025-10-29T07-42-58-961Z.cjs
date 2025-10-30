const fs = require('fs');
const moment = require('moment');

class Node {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.related = [];
  }

  addRelated(node) {
    this.related.push(node);
  }
}

class KnowledgeGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes[node.id] = node;
  }

  connectNodes(id1, id2) {
    if (this.nodes[id1] && this.nodes[id2]) {
      this.nodes[id1].addRelated(this.nodes[id2]);
      this.nodes[id2].addRelated(this.nodes[id1]);
    }
  }

  printGraph() {
    for (const node in this.nodes) {
      console.log(`Node ${node} (${this.nodes[node].label}):`);
      for (const related of this.nodes[node].related) {
        console.log(`  - ${related.id} (${related.label})`);
      }
    }
  }
}

const graph = new KnowledgeGraph();

graph.addNode(new Node('concept1', 'Concept One'));
graph.addNode(new Node('concept2', 'Concept Two'));
graph.addNode(new Node('concept3', 'Concept Three'));

graph.connectNodes('concept1', 'concept2');
graph.connectNodes('concept1', 'concept3');
graph.connectNodes('concept2', 'concept3');

console.log(`Knowledge Graph as of ${moment().format()}:`);
graph.printGraph();