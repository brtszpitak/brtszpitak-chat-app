fs.writeFileSync("contexts.json", "{}");

let contexts = JSON.parse(fs.readFileSync("contexts.json"));

function getContext(userId) {
  return contexts[userId] || {};
}

function saveContext(userId, context) {
  contexts[userId] = context;
  fs.writeFileSync("contexts.json", JSON.stringify(contexts));
}

async function main() {
  let userId = "user123"; // Replace with actual user ID
  let context = getContext(userId);

  console.log("Initial context:", context);

  // Simulate conversation...
  context.lastTopic = "AI features";
  saveContext(userId, context);

  console.log("Updated context:", getContext(userId));
}

main();
