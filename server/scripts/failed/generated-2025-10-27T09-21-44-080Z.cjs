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
  const message = input.trim();
  if (message.startsWith("remember ")) {
    const topic = message.replace("remember ", "");
    knowledgeGraph[topic] = Date.now();
    fs.writeFileSync(
      path.join(__dirname, "knowledge-graph.json"),
      JSON.stringify(knowledgeGraph, null, 2)
    );
    console.log(`Remembered: ${topic}`);
  } else if (message.startsWith("recall ")) {
    const topic = message.replace("recall ", "");
    if (knowledgeGraph[topic]) {
      console.log(
        `Recalled: ${topic} (remembered at ${new Date(knowledgeGraph[topic]).toISOString()})`
      );
    } else {
      console.log(`Unknown topic: ${topic}`);
    }
  } else {
    console.log("Unknown command");
  }
});
