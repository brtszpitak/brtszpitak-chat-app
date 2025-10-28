const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, "knowledgeGraph.json"))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, "knowledgeGraph.json"), "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput === "reset") {
    knowledgeGraph = {};
  } else if (userInput.startsWith("remember:")) {
    const [_, key, value] = userInput.split(":");
    knowledgeGraph[key.trim()] = value.trim();
  } else if (userInput.startsWith("recall:")) {
    const [_, key] = userInput.split(":");
    console.log(knowledgeGraph[key.trim()]);
  } else {
    console.log(
      'Unknown command. Use "remember:<key>:<value>" to store information or "recall:<key>" to retrieve it.'
    );
  }

  fs.writeFileSync(path.join(__dirname, "knowledgeGraph.json"), JSON.stringify(knowledgeGraph));
});

process.stdin.on("end", () => {
  process.exit();
});
