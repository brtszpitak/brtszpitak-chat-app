```cjs
const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge_graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.on('data', async (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  console.log(`User input: ${userInput}`);

  // Simple context-aware response
  if (knowledgeGraph[userInput]) {
    console.log(knowledgeGraph[userInput]);
  } else {
    console.log('I don\'t know that. Please tell me more!');
    const response = await getResponse();
    knowledgeGraph[userInput] = response;
    fs.writeFileSync(path.join(__dirname, 'knowledge_graph.json'), JSON.stringify(knowledgeGraph));
  }
});

async function getResponse() {
  return new Promise((resolve) => {
    process.stdout.write('You: ');
    process.stdin.once('data', (response) => {
      resolve(response.toString().trim());
    });
  });
}
```