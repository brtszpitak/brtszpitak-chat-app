const fs = require('fs');
let knowledgeGraph = {};

function saveGraph() {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph));
}

function loadGraph() {
  try {
    knowledgeGraph = JSON.parse(fs.readFileSync('knowledge-graph.json'));
  } catch (e) {}
}

loadGraph();

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
  const input = data.trim();
  if (!input) return;
  
  const [command, ...args] = input.split(' ');
  
  switch(command) {
    case 'add':
      const [key, value] = args;
      knowledgeGraph[key] = value;
      saveGraph();
      console.log(`Added ${key} => ${value}`);
      break;
    case 'get':
      const keyValue = knowledgeGraph[args[0]];
      if (typeof keyValue !== 'undefined') {
        console.log(keyValue);
      } else {
        console.log('Not found');
      }
      break;
  }
});

process.stdin.on('end', () => process.exit());