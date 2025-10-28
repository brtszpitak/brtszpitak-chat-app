const fs = require('fs');
const path = require('path');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, nodeData) {
    this.graph[nodeId] = nodeData;
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  removeNode(nodeId) {
    delete this.graph[nodeId];
  }

  saveToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      this.graph = JSON.parse(data);
    } catch (err) {
      console.error(`Error loading graph from file: ${err}`);
    }
  }
}

const kg = new KnowledgeGraph();

if (process.argv[2] === '--save') {
  kg.saveToFile('knowledge_graph.json');
} else if (process.argv[2] === '--load') {
  kg.loadFromFile('knowledge_graph.json');
} else {
  console.log('Usage: node script.cjs [--save | --load]');
}

// Example usage:
// kg.addNode('user:1', { preferences: ['music'], interests: ['AI'] });
// kg.addNode('conversation:1', { userId: 'user:1', topic: 'Node.js' });
// kg.saveToFile('knowledge_graph.json');