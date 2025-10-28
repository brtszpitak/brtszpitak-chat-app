const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      context TEXT,
      response TEXT
    );
  `);

  const addConversation = (timestamp, context, response) => {
    db.run(
      `
      INSERT INTO conversations (timestamp, context, response)
      VALUES (?, ?, ?);
    `,
      timestamp,
      context,
      response
    );
  };

  const getConversations = () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM conversations", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  addConversation(
    "2025-10-27T13:33:17.916Z",
    "knowledge graph integration",
    "This is a potential improvement for the Alice project..."
  );

  getConversations()
    .then((conversations) => {
      console.log(conversations);
    })
    .catch((err) => {
      console.error(err);
    });
});
