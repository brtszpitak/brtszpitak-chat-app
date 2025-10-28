const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("knowledge_graph.json", "utf8"));
} catch (e) {}
process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (!message) return;
  const response = respondToMessage(message, data);
  console.log(response);
  fs.writeFileSync("knowledge_graph.json", JSON.stringify(data));
});
function respondToMessage(message, data) {
  // TO DO: implement context-aware knowledge graph logic here
  // for now, just echo the message back
  return `You said: ${message}`;
}
