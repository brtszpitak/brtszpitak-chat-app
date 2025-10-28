console.log("Creating a simple in-memory knowledge graph...");

const graph = {};

function addFact(subject, predicate, object) {
  if (!graph[subject]) graph[subject] = {};
  graph[subject][predicate] = object;
}

function getFact(subject, predicate) {
  return graph[subject]?.[predicate];
}

addFact("user:1", "prefers", "coffee");
addFact("user:2", "prefers", "tea");

console.log(getFact("user:1", "prefers")); // coffee
console.log(getFact("user:2", "prefers")); // tea
