const fs = require("fs");
const path = require("path");

let dbPath = path.join(__dirname, "conversation.db");
let db;

try {
  db = JSON.parse(fs.readFileSync(dbPath));
} catch (e) {
  db = {};
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  let userInput = input.trim();
  if (userInput === "") return;

  if (!db.history) db.history = [];
  db.history.push(userInput);

  fs.writeFileSync(dbPath, JSON.stringify(db));

  console.log(`You said: ${userInput}`);

  // TO DO: implement context-aware response generation
  // for now, just echo the user input
  console.log(`AI response: I'm not smart enough yet...`);
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!");
});
