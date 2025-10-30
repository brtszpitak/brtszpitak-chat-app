const fs = require('fs');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, data) {
    this.graph[nodeId] = data;
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  updateNode(nodeId, updatedData) {
    if (this.graph[nodeId]) {
      this.graph[nodeId] = { ...this.graph[nodeId], ...updatedData };
    }
  }

  save() {
    fs.writeFileSync('knowledge-graph.json', JSON.stringify(this.graph, null, 2));
  }

  load() {
    try {
      const data = fs.readFileSync('knowledge-graph.json', 'utf8');
      this.graph = JSON.parse(data);
    } catch (err) {}
  }
}

const kg = new KnowledgeGraph();
kg.load();

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim();
  if (userInput.startsWith('add ')) {
    const [_, nodeId, data] = userInput.split(' ');
    kg.addNode(nodeId, { data });
  } else if (userInput.startsWith('get ')) {
    const [_, nodeId] = userInput.split(' ');
    console.log(kg.getNode(nodeId));
  } else if (userInput.startsWith('update ')) {
    const [_, nodeId, data] = userInput.split(' ', 3);
    kg.updateNode(nodeId, { data: JSON.parse(data) });
  }
});

process.on('exit', () => {
  kg.save();
});