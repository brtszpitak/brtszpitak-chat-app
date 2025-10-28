const fs = require("fs");
const crypto = require("crypto");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, data) {
    if (!this.graph[nodeId]) {
      this.graph[nodeId] = { id: nodeId, data, connections: {} };
    }
  }

  connectNodes(fromNodeId, toNodeId, connectionType) {
    if (this.graph[fromNodeId] && this.graph[toNodeId]) {
      this.graph[fromNodeId].connections[toNodeId] = connectionType;
      this.graph[toNodeId].connections[fromNodeId] = connectionType;
    }
  }

  queryNode(nodeId) {
    return this.graph[nodeId];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
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

if (!process.argv[2]) {
  console.log("Usage: node script.cjs <command>");
  process.exit(1);
}

switch (process.argv[2]) {
  case "add-node":
    if (process.argv.length < 5) {
      console.log("Usage: node script.cjs add-node <nodeId> <data>");
      process.exit(1);
    }
    graph.addNode(process.argv[3], process.argv[4]);
    break;
  case "connect-nodes":
    if (process.argv.length < 6) {
      console.log("Usage: node script.cjs connect-nodes <fromNodeId> <toNodeId> <connectionType>");
      process.exit(1);
    }
    graph.connectNodes(process.argv[3], process.argv[4], process.argv[5]);
    break;
  case "query-node":
    if (process.argv.length < 4) {
      console.log("Usage: node script.cjs query-node <nodeId>");
      process.exit(1);
    }
    const node = graph.queryNode(process.argv[3]);
    console.log(node ? JSON.stringify(node, null, 2) : "Node not found");
    break;
  default:
    console.log("Unknown command");
    process.exit(1);
}

graph.saveToFile("knowledge-graph.json");
