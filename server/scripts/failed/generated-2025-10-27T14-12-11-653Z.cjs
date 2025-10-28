console.log("Knowledge Graph Initialization");

const graph = {};

function addNode(topic, details) {
  if (!graph[topic]) graph[topic] = { details, related: {} };
}

function relate(topics) {
  for (let i = 0; i < topics.length - 1; i++) {
    const topic = topics[i];
    const nextTopic = topics[i + 1];
    if (graph[topic] && graph[nextTopic]) {
      graph[topic].related[nextTopic] = true;
      graph[nextTopic].related[topic] = true;
    }
  }
}

function recall(topic) {
  if (graph[topic]) return graph[topic].details;
  else return "Unknown topic";
}

addNode("AI", "Artificial Intelligence");
addNode("NLP", "Natural Language Processing");
relate(["AI", "NLP"]);
console.log(recall("AI")); // Output: Artificial Intelligence
