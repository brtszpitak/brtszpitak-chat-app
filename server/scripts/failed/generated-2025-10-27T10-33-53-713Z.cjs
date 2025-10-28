fs.writeFileSync("conversations.json", "{}");

let conversations = require("./conversations.json");
let readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  let conversationLog = {
    timestamp: new Date().toISOString(),
    userMessage: line.trim(),
  };

  conversations[conversationLog.timestamp] = conversationLog;

  fs.writeFileSync("conversations.json", JSON.stringify(conversations, null, 2));

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
