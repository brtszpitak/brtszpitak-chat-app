const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(id, topic) {
    this.graph[id] = { topic, connected: [] };
  }

  connectNodes(node1, node2) {
    if (this.graph[node1] && this.graph[node2]) {
      this.graph[node1].connected.push(node2);
      this.graph[node2].connected.push(node1);
    }
  }

  recallNode(id) {
    return this.graph[id];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph));
  }

  loadFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      this.graph = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile("knowledge-graph.json");

if (process.argv[2] === "--add-node") {
  const id = process.argv[3];
  const topic = process.argv[4];
  graph.addNode(id, topic);
  graph.saveToFile("knowledge-graph.json");
} else if (process.argv[2] === "--connect-nodes") {
  const node1 = process.argv[3];
  const node2 = process.argv[4];
  graph.connectNodes(node1, node2);
  graph.saveToFile("knowledge-graph.json");
} else if (process.argv[2] === "--recall-node") {
  const id = process.argv[3];
  console.log(graph.recallNode(id));
}

graph.saveToFile("knowledge-graph.json");
