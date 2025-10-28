const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, properties) {
    this.graph[nodeId] = properties;
  }

  addEdge(fromNodeId, toNodeId, relation) {
    if (!this.graph[fromNodeId].edges) this.graph[fromNodeId].edges = {};
    if (!this.graph[toNodeId].edges) this.graph[toNodeId].edges = {};
    this.graph[fromNodeId].edges[toNodeId] = relation;
    this.graph[toNodeId].edges[fromNodeId] = `inverse ${relation}`;
  }

  saveToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    this.graph = JSON.parse(data);
  }
}

const kg = new KnowledgeGraph();

kg.loadFromFile("knowledge-graph.json");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userId = "default-user";
  const conversationId = Date.now();
  const nodeId = `${userId}:${conversationId}`;
  kg.addNode(nodeId, { input: input.trim() });

  process.stdout.write(`You said: ${input.trim()}\n`);
});

process.stdin.on("end", () => {
  kg.saveToFile("knowledge-graph.json");
});
