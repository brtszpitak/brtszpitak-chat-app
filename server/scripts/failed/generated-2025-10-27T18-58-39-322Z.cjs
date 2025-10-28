const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(id, topic) {
    this.graph[id] = { topic, connections: {} };
  }

  addConnection(fromId, toId) {
    if (this.graph[fromId] && this.graph[toId]) {
      this.graph[fromId].connections[toId] = true;
      this.graph[toId].connections[fromId] = true;
    }
  }

  recallTopic(id) {
    return this.graph[id]?.topic;
  }

  getConnectedTopics(id) {
    return Object.keys(this.graph[id].connections);
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

graph.addNode("1", "Conversational AI");
graph.addNode("2", "Knowledge Graph");
graph.addConnection("1", "2");

graph.saveToFile("knowledge-graph.json");

console.log(graph.recallTopic("1")); // Output: Conversational AI
console.log(graph.getConnectedTopics("1")); // Output: [ '2' ]
