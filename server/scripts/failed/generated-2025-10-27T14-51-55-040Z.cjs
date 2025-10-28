const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
db.serialize(function () {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      user_input TEXT,
      response TEXT
    );
  `);
});
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput === "exit") process.exit(0);
  db.serialize(function () {
    db.run(
      `
      INSERT INTO conversations (timestamp, user_input)
      VALUES (DATETIME('now'), ?);
    `,
      userInput,
      function (err) {
        if (err) console.error(err);
      }
    );
  });
  const response = `You said: ${userInput}`;
  console.log(response);
});
process.stdin.on("end", () => process.exit(0));
