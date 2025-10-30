const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  let response;
  if (Object.keys(knowledgeGraph).includes(userInput)) {
    response = knowledgeGraph[userInput];
  } else {
    // implement logic to generate a response based on the context
    response = `I'm not sure I understand. Can you please provide more context?`;
  }

  console.log(response);

  process.stdout.write('You: ');
});

process.stdout.write('You: ');