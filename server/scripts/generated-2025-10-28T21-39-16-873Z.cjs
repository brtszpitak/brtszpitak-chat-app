const knowledgeGraph = {};

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const query = input.trim();
  if (query === 'reset') {
    knowledgeGraph = {};
  } else {
    const [command, ...params] = query.split(' ');
    switch (command) {
      case 'set':
        [key, value] = params;
        knowledgeGraph[key] = value;
        break;
      case 'get':
        console.log(knowledgeGraph[params[0]]);
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!');
});