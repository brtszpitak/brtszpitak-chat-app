const fs = require('fs');
const path = require('path');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(topic, info) {
    if (!this.graph[topic]) this.graph[topic] = [];
    this.graph[topic].push(info);
  }

  getNode(topic) {
    return this.graph[topic];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      this.graph = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile('knowledge-graph.json');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [command, topic, info] = input.trim().split(' ');
  switch (command) {
    case 'add':
      graph.addNode(topic, info);
      console.log(`Added node ${topic} with info ${info}`);
      break;
    case 'get':
      const node = graph.getNode(topic);
      console.log(node ? `Node ${topic}: ${node.join(', ')}` : `No node found for topic ${topic}`);
      break;
    case 'save':
      graph.saveToFile('knowledge-graph.json');
      console.log('Graph saved to file');
      break;
  }
});

process.stdin.on('end', () => {
  process.exit();
});