console.log("Context-Aware Knowledge Graph initialization...");

const graph = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const message = input.trim();
  if (!message) return;

  const [command, ...args] = message.split(" ");

  switch (command) {
    case "remember":
      const key = args[0];
      const value = args.slice(1).join(" ");
      graph[key] = value;
      console.log(`Remembered: ${key} = ${value}`);
      break;
    case "recall":
      const recallKey = args[0];
      if (graph[recallKey]) {
        console.log(`Recalled: ${graph[recallKey]}`);
      } else {
        console.log(`Unknown key: ${recallKey}`);
      }
      break;
    default:
      console.log("Unknown command");
  }
});

console.log('Ready to interact. Type "remember <key> <value>" or "recall <key>".');
