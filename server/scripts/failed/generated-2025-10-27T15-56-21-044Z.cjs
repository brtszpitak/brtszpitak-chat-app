const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
db.run(
  `CREATE TABLE IF NOT EXISTS conversations (id INTEGER PRIMARY KEY, timestamp TEXT, message TEXT)`
);

let conversationHistory = [];

process.stdin.setEncoding("utf8");
process.stdin.on("data", (message) => {
  const timestamp = new Date().toISOString();
  db.run(`INSERT INTO conversations (timestamp, message) VALUES (?, ?)`, timestamp, message);
  conversationHistory.push({ timestamp, message });
  console.log(getResponse(message));
});

function getResponse(message) {
  // TO DO: implement context-aware response logic using conversationHistory and db
  return `You said: ${message}`;
}

process.stdin.on("end", () => {
  db.close();
});
