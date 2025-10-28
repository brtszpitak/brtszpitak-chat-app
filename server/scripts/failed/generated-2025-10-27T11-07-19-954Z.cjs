const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let conversations = {};

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const topic = line.trim();
  if (!conversations[topic]) conversations[topic] = [];
  console.log(`Topic: ${topic}`);
  rl.setPrompt("PowerShell command: ");
  rl.prompt();
})
  .on("line", (line) => {
    const command = line.trim();
    conversations[rl.prompt().slice(0, -2)][command] =
      (conversations[rl.prompt().slice(0, -2)][command] || 0) + 1;
    console.log(`Added command: ${command}`);
    rl.setPrompt("You: ");
    rl.prompt();
  })
  .on("SIGINT", () => {
    console.log(conversations);
    process.exit(0);
  });
