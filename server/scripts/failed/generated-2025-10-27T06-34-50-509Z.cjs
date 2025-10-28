console.log("Initializing context-aware knowledge graph...");

const knowledgeGraph = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const conversation = input.trim();
  if (conversation) {
    const parts = conversation.split(" ");
    const intent = parts.shift();
    const entities = {};
    for (const part of parts) {
      const [key, value] = part.split(":");
      entities[key] = value;
    }
    knowledgeGraph[intent] = { ...knowledgeGraph[intent], ...entities };
    console.log(`Knowledge graph updated: ${JSON.stringify(knowledgeGraph)}`);
  }
});
