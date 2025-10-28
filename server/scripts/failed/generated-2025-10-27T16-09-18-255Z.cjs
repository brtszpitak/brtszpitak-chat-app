const fs = require("fs");
const moment = require("moment");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addConcept(concept, description) {
    if (!this.graph[concept]) {
      this.graph[concept] = { description, related: [] };
    }
  }

  relateConcepts(concept1, concept2) {
    if (this.graph[concept1] && this.graph[concept2]) {
      this.graph[concept1].related.push(concept2);
      this.graph[concept2].related.push(concept1);
    }
  }

  getRelatedConcepts(concept) {
    return this.graph[concept]?.related || [];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      this.graph = JSON.parse(data);
    } catch (e) {}
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile("knowledge-graph.json");

if (process.argv[2] === "--add-concept") {
  graph.addConcept(process.argv[3], process.argv[4]);
} else if (process.argv[2] === "--relate-concepts") {
  graph.relateConcepts(process.argv[3], process.argv[4]);
} else if (process.argv[2] === "--get-related") {
  console.log(graph.getRelatedConcepts(process.argv[3]));
}

graph.saveToFile("knowledge-graph.json");
