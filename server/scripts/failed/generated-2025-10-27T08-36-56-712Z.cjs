console.log("Hello! I'm a simple NLP module. Type your query or command:");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  const intent = getIntent(input);
  if (intent === "unknown") console.log("Sorry, I didn't understand that.");
  else handleIntent(intent);
  rl.prompt();
}).on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});

function getIntent(input) {
  const intents = {
    hi: "greeting",
    hello: "greeting",
    "what is your name": "name",
    exit: "quit",
  };
  for (const keyword in intents) {
    if (input.toLowerCase().includes(keyword)) return intents[keyword];
  }
  return "unknown";
}

function handleIntent(intent) {
  switch (intent) {
    case "greeting":
      console.log("Hello!");
      break;
    case "name":
      console.log("I'm Alice, your local AI collaborator.");
      break;
    case "quit":
      rl.close();
      break;
  }
}
