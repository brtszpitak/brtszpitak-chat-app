const fs = require('fs');
const moment = require('moment-timezone');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addConcept(concept, description) {
    if (!this.graph[concept]) {
      this.graph[concept] = { description, related: {} };
    }
  }

  relateConcepts(concept1, concept2) {
    if (this.graph[concept1] && this.graph[concept2]) {
      this.graph[concept1].related[concept2] = true;
      this.graph[concept2].related[concept1] = true;
    }
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filename) {
    try {
      this.graph = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {}
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile('knowledge-graph.json');

if (process.argv[2] === '--add-concept') {
  const concept = process.argv[3];
  const description = process.argv[4];
  graph.addConcept(concept, description);
  console.log(`Added concept: ${concept} - ${description}`);
  graph.saveToFile('knowledge-graph.json');
} else if (process.argv[2] === '--relate-concepts') {
  const concept1 = process.argv[3];
  const concept2 = process.argv[4];
  graph.relateConcepts(concept1, concept2);
  console.log(`Related concepts: ${concept1} and ${concept2}`);
  graph.saveToFile('knowledge-graph.json');
} else if (process.argv[2] === '--query') {
  const concept = process.argv[3];
  if (graph.graph[concept]) {
    console.log(`Description: ${graph.graph[concept].description}`);
    console.log('Related concepts:');
    for (const related in graph.graph[concept].related) {
      console.log(`- ${related}`);
    }
  } else {
    console.log('Concept not found');
  }
}