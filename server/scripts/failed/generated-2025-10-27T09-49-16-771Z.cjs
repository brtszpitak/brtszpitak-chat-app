console.log("Initializing context-aware knowledge graph...");

const knowledgeGraph = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput.startsWith(":remember ")) {
    const [_, key, value] = userInput.split(" ");
    knowledgeGraph[key] = value;
    console.log(`Remembered: ${key} = ${value}`);
  } else if (userInput.startsWith(":recall ")) {
    const [_, key] = userInput.split(" ");
    console.log(knowledgeGraph[key]);
  } else {
    console.log("Unknown command. Use :remember or :recall.");
  }
});

console.log("Ready to interact! Type :remember <key> <value> or :recall <key>");
