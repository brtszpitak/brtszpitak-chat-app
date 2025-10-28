fs.writeFileSync("conversation_history.json", JSON.stringify([]));

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let conversationHistory = JSON.parse(fs.readFileSync("conversation_history.json"));

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  conversationHistory.push({ date: new Date().toISOString(), message: line });
  fs.writeFileSync("conversation_history.json", JSON.stringify(conversationHistory));
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
