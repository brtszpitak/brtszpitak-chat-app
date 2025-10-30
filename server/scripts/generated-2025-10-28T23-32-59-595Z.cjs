console.log('Context-Aware Knowledge Graph');

const graph = {};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [command, ...args] = input.trim().split(/\s+/);
  
  switch(command) {
    case 'add':
      const [entity, property, value] = args;
      if (!graph[entity]) graph[entity] = {};
      graph[entity][property] = value;
      console.log(`Added ${property}=${value} to ${entity}`);
      break;
    
    case 'get':
      const entity = args[0];
      console.log(graph[entity] || {});
      break;
    
    case 'connect':
      const [entity1, property, entity2] = args;
      if (!graph[entity1]) graph[entity1] = {};
      if (!graph[entity2]) graph[entity2] = {};
      graph[entity1][property] = entity2;
      console.log(`Connected ${entity1} to ${entity2} via ${property}`);
      break;
    
    default:
      console.log('Unknown command');
  }
});