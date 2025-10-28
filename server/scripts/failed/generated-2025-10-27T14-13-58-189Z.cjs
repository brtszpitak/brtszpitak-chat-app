console.log("Initializing Knowledge Graph...");

const graph = {};

function addNode(topic, details) {
  if (!graph[topic]) graph[topic] = { details, related: {} };
  Object.assign(graph[topic].details, details);
}

function relate(topics) {
  for (let i = 0; i < topics.length - 1; i++) {
    const topicA = topics[i];
    const topicB = topics[i + 1];
    if (!graph[topicA].related[topicB]) graph[topicA].related[topicB] = true;
    if (!graph[topicB].related[topicA]) graph[topicB].related[topicA] = true;
  }
}

function query(topic) {
  const node = graph[topic];
  if (node) {
    console.log(`Topic: ${topic}`);
    console.log(`Details:`, node.details);
    console.log(`Related Topics:`, Object.keys(node.related));
  } else {
    console.log(`Unknown topic: ${topic}`);
  }
}

// Example usage:
addNode("Knowledge Graph", { description: "A graph to store and connect information" });
addNode("AI Assistant", { description: "A conversational AI" });
relate(["Knowledge Graph", "AI Assistant"]);
query("Knowledge Graph");
