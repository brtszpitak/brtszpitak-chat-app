const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.on('data', (input) => {
  const message = input.toString().trim();
  if (!message) return;

  const [command, ...args] = message.split(/\s+/);

  switch (command) {
    case 'remember':
      const topic = args.join(' ');
      knowledgeGraph[topic] = true;
      fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
      console.log(`Remembered: ${topic}`);
      break;
    case 'recall':
      const recalledTopic = args.join(' ');
      if (knowledgeGraph[recalledTopic]) {
        console.log(`Recalled: ${recalledTopic}`);
      } else {
        console.log(`Unknown topic: ${recalledTopic}`);
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }
});