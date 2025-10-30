const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  const conversationId = Date.now() + Math.random().toString(36).substr(2, 9);

  knowledgeGraph[conversationId] = { userInputs: [userInput], responses: [] };

  console.log(`You said: ${userInput}`);
  console.log('How would you like me to respond? (type "exit" to quit)');

  process.stdin.on('data', (response) => {
    const responseText = response.toString().trim();
    if (responseText === 'exit') process.exit(0);

    knowledgeGraph[conversationId].responses.push(responseText);
    saveKnowledgeGraph();

    console.log(`I responded: ${responseText}`);
    console.log('What would you like to say next?');
  });
});