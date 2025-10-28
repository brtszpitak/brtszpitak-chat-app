console.log('Context-Aware Knowledge Graph');

const knowledgeGraph = {};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput.startsWith(':')) {
    const [command, ...args] = userInput.slice(1).split(' ');
    switch (command) {
      case 'forget':
        delete knowledgeGraph[args[0]];
        console.log(`Forgot ${args[0]}`);
        break;
      case 'remember':
        knowledgeGraph[args[0]] = args.slice(1).join(' ');
        console.log(`Remembered ${args[0]}: ${knowledgeGraph[args[0]]}`);
        break;
      default:
        console.log('Unknown command');
    }
  } else {
    const response = Object.keys(knowledgeGraph).find((key) => userInput.includes(key));
    if (response) {
      console.log(`You mentioned ${response}: ${knowledgeGraph[response]}`);
    } else {
      console.log('I didn\'t understand that');
    }
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});