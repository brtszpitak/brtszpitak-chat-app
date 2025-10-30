console.log('Knowledge Graph Initialization');

const graph = {};

function addConcept(concept) {
  if (!graph[concept]) graph[concept] = { connections: {} };
}

function connectConcepts(from, to, relation) {
  if (graph[from] && graph[to])
    graph[from].connections[to] = relation;
}

addConcept('Node.js');
addConcept('Knowledge Graph');
addConcept('Context-Aware Responses');

connectConcepts('Node.js', 'Knowledge Graph', 'uses');
connectConcepts('Knowledge Graph', 'Context-Aware Responses', 'enables');
connectConcepts('Context-Aware Responses', 'Node.js', 'provided by');

console.log(graph);