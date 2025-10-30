const fs = require('fs');
const path = require('path');

let storagePath = path.join(__dirname, 'knowledgeGraph.json');

let knowledgeGraph = {};

try {
  knowledgeGraph = JSON.parse(fs.readFileSync(storagePath));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  let userQuery = input.trim();
  
  if (userQuery) {
    let response = 'I do not understand.';
    
    // TO DO: implement context-aware knowledge graph logic here
    
    console.log(response);
    
    let interaction = { query: userQuery, response };
    knowledgeGraph[Date.now()] = interaction;
    
    fs.writeFileSync(storagePath, JSON.stringify(knowledgeGraph));
  }
});

process.stdin.on('end', () => {
  process.exit();
});