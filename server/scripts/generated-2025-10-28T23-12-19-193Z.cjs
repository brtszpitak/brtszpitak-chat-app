console.log('Alice Knowledge Graph Integrator');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY,
      timestamp TEXT,
      context TEXT,
      details TEXT
    );
  `);

  const conversationData = [
    { timestamp: '2025-10-28T23:10:02.270Z', context: 'Alice project improvement', details: 'Integrate a knowledge graph or database' },
  ];

  db.run(`
    INSERT INTO conversations (timestamp, context, details)
    VALUES (?, ?, ?);
  `, conversationData[0].timestamp, conversationData[0].context, conversationData[0].details);

  db.each('SELECT * FROM conversations', (err, row) => {
    if (err) console.error(err);
    else console.log(`Timestamp: ${row.timestamp}, Context: ${row.context}, Details: ${row.details}`);
  });
});