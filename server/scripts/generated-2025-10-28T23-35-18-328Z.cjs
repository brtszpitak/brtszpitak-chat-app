```cjs
const fs = require('fs');
const path = require('path');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, data) {
    this.graph[nodeId] = data;
  }

  connectNodes(fromNodeId, toNodeId, relation) {
    if (!this.graph[fromNodeId].connections) {
      this.graph[fromNodeId].connections = {};
    }
    this.graph[fromNodeId].connections[toNodeId] = relation;
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    this.graph = JSON.parse(data);
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile('knowledge-graph.json');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput.startsWith('add ')) {
    const [_, nodeId, data] = userInput.split(' ');
    graph.addNode(nodeId, data);
  } else if (userInput.startsWith('connect ')) {
    const [_, fromNodeId, toNodeId, relation] = userInput.split(' ');
    graph.connectNodes(fromNodeId, toNodeId, relation);
  } else if (userInput === 'save') {
    graph.saveToFile('knowledge-graph.json');
  } else if (userInput.startsWith('get ')) {
    const [_, nodeId] = userInput.split(' ');
    console.log(graph.getNode(nodeId));
  }
});

process.stdin.on('end', () => {
  process.exit();
});
```