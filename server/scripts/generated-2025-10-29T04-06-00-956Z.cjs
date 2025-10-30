const knowledgeGraph = {};

function addNode(topic, info) {
  if (!knowledgeGraph[topic]) knowledgeGraph[topic] = { info, related: {} };
  else knowledgeGraph[topic].info = info;
}

function connectNodes(topic1, topic2) {
  if (knowledgeGraph[topic1] && knowledgeGraph[topic2]) {
    knowledgeGraph[topic1].related[topic2] = true;
    knowledgeGraph[topic2].related[topic1] = true;
  }
}

function queryNode(topic) {
  return knowledgeGraph[topic];
}

addNode('AI', 'Artificial Intelligence');
addNode('ML', 'Machine Learning');
connectNodes('AI', 'ML');

console.log(queryNode('AI'));