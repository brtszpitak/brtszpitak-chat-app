const fs = require("fs");
const moment = require("moment");

class Concept {
  constructor(name) {
    this.name = name;
    this.relatedConcepts = [];
  }

  addRelatedConcept(concept) {
    this.relatedConcepts.push(concept);
  }
}

class KnowledgeGraph {
  constructor() {
    this.concepts = {};
  }

  addConcept(name) {
    if (!this.concepts[name]) {
      this.concepts[name] = new Concept(name);
    }
    return this.concepts[name];
  }

  connectConcepts(concept1, concept2) {
    this.addConcept(concept1).addRelatedConcept(this.addConcept(concept2));
    this.addConcept(concept2).addRelatedConcept(this.addConcept(concept1));
  }

  getRelatedConcepts(conceptName) {
    return this.concepts[conceptName].relatedConcepts.map((concept) => concept.name);
  }
}

const graph = new KnowledgeGraph();

graph.connectConcepts("Node.js", "JavaScript");
graph.connectConcepts("Node.js", "Server-side");
graph.connectConcepts("JavaScript", "Client-side");

console.log(graph.getRelatedConcepts("Node.js"));
