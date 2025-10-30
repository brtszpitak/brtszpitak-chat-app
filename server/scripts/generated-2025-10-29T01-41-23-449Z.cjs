const fs = require('fs');
const path = require('path');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(nodeId, data) {
    this.graph[nodeId] = data;
  }

  getNode(nodeId) {
    return this.graph[nodeId];
  }

  addEdge(fromNodeId, toNodeId) {
    if (!this.graph[fromNodeId].edges) {
      this.graph[fromNodeId].edges = [];
    }
    this.graph[fromNodeId].edges.push(toNodeId);
  }

  getEdges(fromNodeId) {
    return this.graph[fromNodeId].edges;
  }

  serialize() {
    return JSON.stringify(this.graph, null, 2);
  }

  deserialize(data) {
    this.graph = JSON.parse(data);
  }
}

class Conversation {
  constructor(knowledgeGraph) {
    this.knowledgeGraph = knowledgeGraph;
    this.context = {};
  }

  addContext(nodeId, data) {
    this.context[nodeId] = data;
    this.knowledgeGraph.addNode(nodeId, data);
  }

  getContext(nodeId) {
    return this.context[nodeId];
  }

  respond(input) {
    // Simple response generation for demonstration purposes
    const nodeId = `response-${input}`;
    const response = `You said: ${input}`;
    this.addContext(nodeId, { input, response });
    return response;
  }

  save() {
    fs.writeFileSync('knowledge-graph.json', this.knowledgeGraph.serialize());
  }

  load() {
    try {
      const data = fs.readFileSync('knowledge-graph.json', 'utf8');
      this.knowledgeGraph.deserialize(data);
    } catch (err) {
      console.error(err);
    }
  }
}

const conversation = new Conversation(new KnowledgeGraph());

conversation.load();

console.log(conversation.respond('Hello, Alice!'));
console.log(conversation.respond('How can you improve?'));

conversation.save();