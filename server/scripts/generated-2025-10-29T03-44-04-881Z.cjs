const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class KnowledgeGraph {
  constructor() {
    this.graph = {};
  }

  addNode(conversationId, userId, topic, data) {
    if (!this.graph[conversationId]) this.graph[conversationId] = {};
    if (!this.graph[conversationId][userId]) this.graph[conversationId][userId] = {};
    if (!this.graph[conversationId][userId][topic]) this.graph[conversationId][userId][topic] = [];
    this.graph[conversationId][userId][topic].push(data);
  }

  getNode(conversationId, userId, topic) {
    return this.graph[conversationId]?.[userId]?.[topic];
  }

  save() {
    fs.writeFileSync('knowledge-graph.json', JSON.stringify(this.graph, null, 2));
  }

  load() {
    try {
      this.graph = JSON.parse(fs.readFileSync('knowledge-graph.json', 'utf8'));
    } catch (e) {}
  }
}

const kg = new KnowledgeGraph();
kg.load();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const input = data.trim().split('\n');
  const conversationId = uuidv4();
  for (const line of input) {
    const [topic, ...data] = line.split(': ');
    kg.addNode(conversationId, 'user', topic, data.join(': ').trim());
  }
  kg.save();
});

process.stdin.on('end', () => process.exit());