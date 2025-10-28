const fs = require("fs");
let graph = {};

function saveGraph() {
  fs.writeFileSync("graph.json", JSON.stringify(graph, null, 2));
}

function loadGraph() {
  try {
    graph = JSON.parse(fs.readFileSync("graph.json"));
  } catch (e) {}
}

loadGraph();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userQuery = input.trim();
  if (!userQuery) return;

  if (!graph[userQuery]) graph[userQuery] = {};

  console.log(`You said: ${userQuery}`);

  process.stdout.write("My response: ");
  process.stdin.once("data", (response) => {
    graph[userQuery][Date.now()] = response.toString().trim();
    saveGraph();
    console.log(`Response saved.\n`);
  });
});

process.on("SIGINT", () => {
  saveGraph();
  console.log("\nGoodbye!");
  process.exit(0);
});
