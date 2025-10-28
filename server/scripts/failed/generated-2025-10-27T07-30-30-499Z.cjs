const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

try {
  const graphData = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8");
  knowledgeGraph = JSON.parse(graphData);
} catch (err) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const conversationId = Date.now().toString();
  const userInput = input.trim();

  // Process user input and update the graph
  if (!knowledgeGraph[conversationId]) knowledgeGraph[conversationId] = {};
  knowledgeGraph[conversationId][userInput] = true;

  fs.writeFileSync(
    path.join(__dirname, "knowledge-graph.json"),
    JSON.stringify(knowledgeGraph, null, 2)
  );

  console.log(`Conversation ID: ${conversationId}`);
  console.log(`User input: ${userInput}`);
  console.log("Knowledge graph updated!");
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!\n");
});
