const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addConcept(concept) {
    const id = uuidv4();
    this.graph[id] = { concept, connections: {} };
    return id;
  }

  connectConcepts(id1, id2, relation) {
    if (this.graph[id1] && this.graph[id2]) {
      this.graph[id1].connections[id2] = relation;
      this.graph[id2].connections[id1] = relation;
    }
  }

  recallConversation(conversationId) {
    const conversation = {};
    for (const conceptId in this.graph) {
      if (this.graph[conceptId].concept.conversation === conversationId) {
        conversation[conceptId] = this.graph[conceptId];
      }
    }
    return conversation;
  }

  saveGraph() {
    fs.writeFileSync('knowledge-graph.json', JSON.stringify(this.graph, null, 2));
  }

  loadGraph() {
    try {
      const graph = fs.readFileSync('knowledge-graph.json', 'utf8');
      this.graph = JSON.parse(graph);
    } catch (e) {}
  }
}

const kg = new KnowledgeGraph();
kg.loadGraph();

// Example usage:
const concept1Id = kg.addConcept({ name: 'Alice', conversation: '2025-10-29T01:20:00.013Z' });
const concept2Id = kg.addConcept({ name: 'Knowledge Graph', conversation: '2025-10-29T01:20:00.013Z' });
kg.connectConcepts(concept1Id, concept2Id, 'related to');

console.log(kg.recallConversation('2025-10-29T01:20:00.013Z'));

kg.saveGraph();