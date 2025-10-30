const fs = require('fs');
let knowledgeGraph = {};

try {
  const storedGraph = fs.readFileSync('knowledge-graph.json', 'utf8');
  knowledgeGraph = JSON.parse(storedGraph);
} catch (err) {}

process.stdin.on('data', (input) => {
  const userQuery = input.toString().trim();
  if (userQuery !== '') {
    console.log(`You said: ${userQuery}`);
    const response = generateResponse(userQuery, knowledgeGraph);
    console.log(`I respond: ${response}`);
    updateKnowledgeGraph(userQuery, response, knowledgeGraph);
  }
});

process.stdin.setEncoding('utf8');

function generateResponse(query, graph) {
  // TO DO: implement actual response generation logic based on the knowledge graph
  return `Sorry, I'm still learning!`;
}

function updateKnowledgeGraph(query, response, graph) {
  const timestamp = new Date().toISOString();
  graph[timestamp] = { query, response };
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(graph, null, 2));
}