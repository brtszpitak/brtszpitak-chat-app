const fs = require("fs");
const moment = require("moment");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(id, data) {
    this.graph[id] = data;
  }

  addEdge(from, to) {
    if (!this.graph[from].edges) this.graph[from].edges = [];
    this.graph[from].edges.push(to);
  }

  getConnectedNodes(nodeId) {
    return this.graph[nodeId].edges || [];
  }
}

const kg = new KnowledgeGraph();

kg.addNode("topic1", { name: "Topic 1" });
kg.addNode("topic2", { name: "Topic 2" });
kg.addEdge("topic1", "topic2");

console.log(kg.getConnectedNodes("topic1")); // Output: [ 'topic2' ]

fs.writeFileSync("knowledge-graph.json", JSON.stringify(kg.graph, null, 2));

console.log(`Knowledge graph saved to knowledge-graph.json at ${moment().format()}`);
