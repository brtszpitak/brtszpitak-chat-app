const fs = require('fs');
const moment = require('moment');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(node) {
    if (!this.graph[node.id]) {
      this.graph[node.id] = node;
    }
  }

  addEdge(from, to) {
    if (this.graph[from] && this.graph[to]) {
      if (!this.graph[from].edges) {
        this.graph[from].edges = [];
      }
      this.graph[from].edges.push(to);
    }
  }

  queryNode(id) {
    return this.graph[id];
  }

  queryEdge(from, to) {
    const node = this.queryNode(from);
    if (node && node.edges) {
      return node.edges.includes(to);
    }
    return false;
  }
}

const graph = new KnowledgeGraph();

graph.addNode({ id: 'concepts', label: 'Concepts' });
graph.addNode({ id: 'entities', label: 'Entities' });
graph.addNode({ id: 'topics', label: 'Topics' });

graph.addEdge('concepts', 'entities');
graph.addEdge('concepts', 'topics');
graph.addEdge('entities', 'topics');

console.log(graph.queryNode('concepts'));
console.log(graph.queryEdge('concepts', 'entities'));