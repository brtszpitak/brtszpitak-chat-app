console.log('Implementing a context-aware knowledge graph is a great idea! However, creating a fully functional knowledge graph in a single Node.js script is quite complex. Here\'s a simplified example of how you might start building such a system:

const knowledgeGraph = {
  entities: {},
  topics: {},
  tasks: {}
};

function addEntity(name) {
  knowledgeGraph.entities[name] = {};
}

function addTopic(name, relatedEntities) {
  knowledgeGraph.topics[name] = relatedEntities;
}

function addTask(name, relatedTopics) {
  knowledgeGraph.tasks[name] = relatedTopics;
}

addEntity(\'Alice\');
addEntity(\'Bartosz\');

addTopic(\'Node.js\', [\'Alice\', \'Bartosz\']);
addTopic(\'Knowledge Graph\', [\'Alice\']);

addTask(\'Implement Knowledge Graph\', [\'Knowledge Graph\', \'Node.js\']);

console.log(knowledgeGraph);');