console.log(
  "Implementing a context-aware knowledge graph is a great idea! However, creating a fully functional graph in a single Node.js script is a complex task that requires a significant amount of code and dependencies."
);

const graph = {};

graph.addNode = (id, topic) => {
  if (!graph[id]) graph[id] = { id, topic, related: {} };
};

graph.addEdge = (id1, id2, relationship) => {
  if (graph[id1] && graph[id2]) {
    graph[id1].related[id2] = relationship;
    graph[id2].related[id1] = relationship;
  }
};

graph.addNode("A", "User Requests");
graph.addNode("B", "Context Awareness");
graph.addEdge("A", "B", "related to");

console.log(graph);
