console.log('Context-Aware Knowledge Graph Initiative Launched!');
const graph = {};
process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  if (!graph[input]) graph[input] = { related: {} };
  console.log(`Node created for ${input}`);
  console.log('Enter related topics (one per line, Ctrl+D to finish)');
  let relatedTopics = '';
  process.stdin.on('data', (relatedChunk) => {
    relatedTopics += relatedChunk.toString();
    const topics = relatedTopics.trim().split('\n');
    topics.forEach((topic) => {
      if (!graph[topic]) graph[topic] = { related: {} };
      graph[input].related[topic] = true;
      graph[topic].related[input] = true;
    });
  });
  process.stdin.on('end', () => {
    console.log('Graph updated!');
    console.log(JSON.stringify(graph, null, 2));
  });
});