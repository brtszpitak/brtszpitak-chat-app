const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledgeGraph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledgeGraph.json'), 'utf8'));
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const conversation = input.trim();
  if (conversation !== '') {
    const [command, ...args] = conversation.split(' ');
    switch (command) {
      case 'remember':
        knowledgeGraph[args[0]] = args.slice(1).join(' ');
        break;
      case 'recall':
        console.log(knowledgeGraph[args[0]]);
        break;
      default:
        console.log('Unknown command');
    }
  }
});

process.on('exit', () => {
  fs.writeFileSync(path.join(__dirname, 'knowledgeGraph.json'), JSON.stringify(knowledgeGraph));
});