console.log(
  "Implementing a context-aware knowledge graph is a complex task that requires a significant amount of development, data storage, and processing power. This script is a simplified demonstration of how you might approach this idea."
);

const conversations = {};

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (!message) return;

  const context = Object.keys(conversations).find((key) => message.includes(key));
  if (context) {
    console.log(`Recalling previous conversation about ${context}:`);
    console.log(conversations[context]);
  } else {
    console.log("No relevant context found. Starting a new conversation...");
    const topic = promptUserForTopic();
    conversations[topic] = message;
    console.log(`Conversation about ${topic} saved.`);
  }
});

function promptUserForTopic() {
  console.log("Please enter a topic for this conversation:");
  return promptSync();
}

function promptSync() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("> ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}
