const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8");
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.on("data", (input) => {
  const userInput = input.toString().trim();
  if (!userInput) return;

  const now = new Date().toISOString();
  const conversationId = `conversation-${now}`;
  knowledgeGraph[conversationId] = { userInputs: [userInput], responses: [] };

  fs.writeFileSync(
    path.join(__dirname, "knowledge-graph.json"),
    JSON.stringify(knowledgeGraph, null, 2)
  );

  console.log(`You said: ${userInput}`);
  console.log('How would you like me to respond? (type "exit" to quit)');
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
