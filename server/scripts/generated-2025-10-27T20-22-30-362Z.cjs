const fs = require("fs");
const moment = require("moment");

class Node {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.properties = {};
    this.connections = [];
  }

  addProperty(key, value) {
    this.properties[key] = value;
  }

  connect(node) {
    this.connections.push(node);
  }
}

class KnowledgeGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(id, label) {
    if (!this.nodes[id]) {
      this.nodes[id] = new Node(id, label);
    }
    return this.nodes[id];
  }

  connectNodes(fromId, toId) {
    const fromNode = this.addNode(fromId, "");
    const toNode = this.addNode(toId, "");
    fromNode.connect(toNode);
  }

  save() {
    fs.writeFileSync("knowledge-graph.json", JSON.stringify(this.nodes, null, 2));
  }
}

const graph = new KnowledgeGraph();

graph.addNode("user-preferences", "User Preferences");
graph.addNode("tasks", "Tasks");
graph.addNode("interactions", "Interactions");

graph.connectNodes("user-preferences", "tasks");
graph.connectNodes("tasks", "interactions");
graph.connectNodes("interactions", "user-preferences");

console.log(`Knowledge graph created at ${moment().format()}`);
graph.save();
