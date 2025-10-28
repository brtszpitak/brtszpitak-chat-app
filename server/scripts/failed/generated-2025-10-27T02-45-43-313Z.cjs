const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, "knowledge-graph.json"))) {
  knowledgeGraph = JSON.parse(
    fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8")
  );
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput !== "") {
    const now = new Date().toISOString();
    knowledgeGraph[now] = userInput;
    fs.writeFileSync(
      path.join(__dirname, "knowledge-graph.json"),
      JSON.stringify(knowledgeGraph, null, 2)
    );
  }
});

process.stdin.on("end", () => {
  process.stdout.write(`Knowledge graph saved. Goodbye!\n`);
});
