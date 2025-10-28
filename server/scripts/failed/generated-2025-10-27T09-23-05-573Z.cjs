const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8");
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const [key, value] = command.slice(9).trim().split(": ", 2);
    knowledgeGraph[key] = value;
    fs.writeFileSync(
      path.join(__dirname, "knowledge-graph.json"),
      JSON.stringify(knowledgeGraph, null, 2)
    );
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith("recall ")) {
    const key = command.slice(7).trim();
    console.log(knowledgeGraph[key] || `Unknown: ${key}`);
  }
});

process.stdin.on("end", () => process.exit());
