const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, nodeData) {
    if (!this.graph[nodeId]) {
      this.graph[nodeId] = nodeData;
    }
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  addEdge(fromNodeId, toNodeId, edgeData) {
    if (this.graph[fromNodeId] && this.graph[toNodeId]) {
      if (!this.graph[fromNodeId].edges) {
        this.graph[fromNodeId].edges = {};
      }
      this.graph[fromNodeId].edges[toNodeId] = edgeData;
    }
  }

  getEdge(fromNodeId, toNodeId) {
    return this.graph[fromNodeId]?.edges?.[toNodeId];
  }

  saveToFile() {
    fs.writeFileSync("knowledge-graph.json", JSON.stringify(this.graph, null, 2));
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync("knowledge-graph.json", "utf8");
      this.graph = JSON.parse(data);
    } catch (err) {}
  }
}

const kg = new KnowledgeGraph();
kg.loadFromFile();

process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  if (input.startsWith("add node")) {
    const [_, nodeId, nodeData] = input.split(" ");
    kg.addNode(nodeId, nodeData);
  } else if (input.startsWith("add edge")) {
    const [_, fromNodeId, toNodeId, edgeData] = input.split(" ");
    kg.addEdge(fromNodeId, toNodeId, edgeData);
  } else if (input === "save") {
    kg.saveToFile();
  } else if (input === "load") {
    kg.loadFromFile();
  }
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
