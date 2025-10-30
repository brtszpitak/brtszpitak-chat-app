const fs = require('fs');
let graph = {};

function saveGraph() {
  fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2));
}

function loadGraph() {
  try {
    graph = JSON.parse(fs.readFileSync('graph.json'));
  } catch (e) {}
}

loadGraph();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const query = input.trim();
  if (!query) return;

  console.log(`You said: ${query}`);

  // Simple context-aware response
  if (graph[query]) {
    console.log(`I remember you asked about ${query} before!`);
    console.log(graph[query]);
  } else {
    console.log("I don't know much about that. Yet!");
    graph[query] = 'Unknown';
  }

  saveGraph();
});

process.stdin.on('end', () => process.exit());