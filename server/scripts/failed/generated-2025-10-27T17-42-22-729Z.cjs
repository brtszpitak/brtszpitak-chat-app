const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.graph = {};
    this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(this.dataPath, "utf8");
      this.graph = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
  }

  save() {
    fs.writeFileSync(this.dataPath, JSON.stringify(this.graph));
  }

  addNode(nodeId, nodeData) {
    this.graph[nodeId] = nodeData;
    this.save();
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  updateNode(nodeId, updatedData) {
    if (this.graph[nodeId]) {
      Object.assign(this.graph[nodeId], updatedData);
      this.save();
    }
  }
}

const graph = new KnowledgeGraph(path.join(__dirname, "knowledge-graph.json"));

graph.addNode("user-preferences", {});

console.log(graph.getNode("user-preferences"));
