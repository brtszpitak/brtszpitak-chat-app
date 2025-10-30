const fs = require('fs');
const moment = require('moment');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addConcept(concept, properties) {
    if (!this.graph[concept]) {
      this.graph[concept] = properties;
    } else {
      Object.assign(this.graph[concept], properties);
    }
  }

  connectConcepts(from, to, relation) {
    if (!this.graph[from].relations) {
      this.graph[from].relations = {};
    }
    this.graph[from].relations[to] = relation;
  }

  getRelatedConcepts(concept) {
    return this.graph[concept].relations || {};
  }
}

const graph = new KnowledgeGraph();
graph.addConcept('AI', { description: 'Artificial Intelligence' });
graph.addConcept('Node.js', { description: 'JavaScript runtime environment' });
graph.connectConcepts('AI', 'Node.js', 'uses');
graph.connectConcepts('Node.js', 'AI', 'powered_by');

console.log(graph.getRelatedConcepts('AI'));
console.log(graph.getRelatedConcepts('Node.js'));

fs.writeFileSync('knowledge_graph.json', JSON.stringify(graph.graph, null, 2));
console.log(`Knowledge graph saved to knowledge_graph.json at ${moment().format()}`);