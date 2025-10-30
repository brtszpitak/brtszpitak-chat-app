const fs = require('fs');
const path = require('path');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(node) {
    if (!this.graph[node.id]) {
      this.graph[node.id] = node;
    }
  }

  getNode(id) {
    return this.graph[id];
  }

  addEdge(from, to) {
    if (this.graph[from] && this.graph[to]) {
      if (!this.graph[from].edges) {
        this.graph[from].edges = [];
      }
      this.graph[from].edges.push(to);
    }
  }

  serialize() {
    return JSON.stringify(this.graph, null, 2);
  }

  deserialize(data) {
    this.graph = JSON.parse(data);
  }
}

const kg = new KnowledgeGraph();

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  if (input.startsWith('add node ')) {
    const [_, id, label] = input.split(' ');
    kg.addNode({ id, label });
  } else if (input.startsWith('add edge ')) {
    const [_, from, to] = input.split(' ');
    kg.addEdge(from, to);
  } else if (input === 'serialize') {
    console.log(kg.serialize());
  }
});

process.stdin.setEncoding('utf8');