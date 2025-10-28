const fs = require("fs");
const jsonGraph = {};

function addNode(id, properties) {
  jsonGraph[id] = properties;
}

function getNode(id) {
  return jsonGraph[id];
}

function removeNode(id) {
  delete jsonGraph[id];
}

function saveGraph() {
  fs.writeFileSync("knowledge_graph.json", JSON.stringify(jsonGraph, null, 2));
}

function loadGraph() {
  try {
    const data = fs.readFileSync("knowledge_graph.json", "utf8");
    jsonGraph = JSON.parse(data);
  } catch (e) {}
}

loadGraph();

// Example usage:
addNode("user-preferences", { theme: "dark", language: "en" });
addNode("user-habits", { frequentTopics: ["AI", "Node.js"] });
console.log(getNode("user-preferences"));
saveGraph();
