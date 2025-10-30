console.log('Initializing context-aware knowledge graph...');

const knowledgeGraph = {};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  const [command, ...args] = userInput.split(' ');
  switch (command) {
    case 'remember':
      const key = args[0];
      const value = args.slice(1).join(' ');
      knowledgeGraph[key] = value;
      console.log(`Remembered: ${key} = ${value}`);
      break;
    case 'forget':
      delete knowledgeGraph[args[0]];
      console.log(`Forgot: ${args[0]}`);
      break;
    case 'recall':
      const recalledValue = knowledgeGraph[args[0]];
      if (recalledValue) {
        console.log(`Recall: ${args[0]} = ${recalledValue}`);
      } else {
        console.log(`Unknown: ${args[0]}`);
      }
      break;
    default:
      console.log('Unknown command. Try "remember", "forget", or "recall"');
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});