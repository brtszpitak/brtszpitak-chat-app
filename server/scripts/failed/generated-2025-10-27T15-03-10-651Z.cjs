const fs = require("fs");
let knowledgeGraph = {};

try {
  knowledgeGraph = JSON.parse(fs.readFileSync("knowledge-graph.json", "utf8"));
} catch (e) {}

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (!input) return;

  const [command, ...args] = input.split(" ");
  switch (command) {
    case "set":
      const [key, value] = args;
      knowledgeGraph[key] = value;
      break;
    case "get":
      console.log(knowledgeGraph[args[0]]);
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }

  fs.writeFileSync("knowledge-graph.json", JSON.stringify(knowledgeGraph));
});

process.stdin.setEncoding("utf8");
