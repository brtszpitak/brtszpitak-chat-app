const fs = require("fs");
const path = require("path");

let conversations = {};

if (fs.existsSync(path.join(__dirname, "conversations.json"))) {
  conversations = JSON.parse(fs.readFileSync(path.join(__dirname, "conversations.json"), "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", async (input) => {
  const userId = Math.floor(Math.random() * 1000000); // temporary user ID
  const userInput = input.trim();

  if (!conversations[userId]) conversations[userId] = [];
  conversations[userId].push(userInput);

  fs.writeFileSync(path.join(__dirname, "conversations.json"), JSON.stringify(conversations));

  console.log(`You said: ${userInput}`);

  // TO DO: implement natural language processing to identify relevant follow-up topics or tasks
  console.log("Alice: I'm still learning...");

  process.stdout.write("> ");
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!");
});
