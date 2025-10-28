console.log("Context-Aware Knowledge Graph Roadmap Script");

const graph = {};

graph.addNode = (id, type, props) => {
  if (!graph[id]) graph[id] = { id, type, props: {} };
  Object.assign(graph[id].props, props);
};

graph.addEdge = (from, to, relation) => {
  if (!graph[from].edges) graph[from].edges = {};
  graph[from].edges[to] = relation;
};

graph.query = (id, depth = 1) => {
  const visited = new Set();
  const result = [];

  function traverse(nodeId, currentDepth) {
    if (visited.has(nodeId) || currentDepth > depth) return;
    visited.add(nodeId);
    result.push(graph[nodeId]);
    if (graph[nodeId].edges) {
      Object.keys(graph[nodeId].edges).forEach((to) => traverse(to, currentDepth + 1));
    }
  }

  traverse(id, 1);
  return result;
};

// Sample data
graph.addNode("user_request", "concept", { description: "User's query" });
graph.addNode("entity1", "entity", { name: "Alice" });
graph.addNode("task1", "task", { title: "Book a flight" });
graph.addEdge("user_request", "entity1", "mentions");
graph.addEdge("user_request", "task1", "related_to");

// Query the graph
const result = graph.query("user_request");
console.log(result);
