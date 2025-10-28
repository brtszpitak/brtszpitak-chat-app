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
}

const kg = new KnowledgeGraph();

kg.addConcept("Knowledge Graph", "A data structure to store and connect concepts");
kg.addConcept("AI Assistant", "A program that provides accurate and context-aware responses");
kg.relateConcepts("Knowledge Graph", "AI Assistant");

console.log(kg.getRelatedConcepts("Knowledge Graph"));
