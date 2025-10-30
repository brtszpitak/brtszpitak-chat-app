const fs = require('fs');
const readline = require('readline');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addConcept(concept, relationships = {}) {
    this.graph[concept] = relationships;
  }

  getRelatedConcepts(concept) {
    return this.graph[concept];
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.graph, null, 2));
  }

  loadFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      this.graph = JSON.parse(data);
    } catch (e) {
      console.error(`Error loading file: ${e}`);
    }
  }
}

const graph = new KnowledgeGraph();
graph.loadFromFile('knowledge_graph.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a concept or "quit" to exit: ', (concept) => {
  if (concept.toLowerCase() === 'quit') {
    graph.saveToFile('knowledge_graph.json');
    rl.close();
  } else {
    rl.question(`Enter relationships for ${concept} (comma-separated): `, (relationships) => {
      const rels = relationships.split(',').map((r) => r.trim());
      graph.addConcept(concept, rels);
      console.log(`Added concept "${concept}" with relationships: ${rels.join(', ')}`);
      rl.question('Enter a concept or "quit" to exit: ', (nextConcept) => {
        rl.emit('line', nextConcept);
      });
    });
  }
});