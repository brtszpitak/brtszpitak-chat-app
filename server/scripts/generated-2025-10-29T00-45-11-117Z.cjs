const fs = require('fs');
const dbFile = 'alice-db.json';

let db = {};

try {
  db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', input => {
  const conversation = input.trim();
  if (conversation !== '') {
    const response = `I'm not sure what to say about ${conversation}.`;
    db[conversation] = response;
    fs.writeFileSync(dbFile, JSON.stringify(db));
    console.log(response);
  }
});

process.stdin.on('end', () => process.exit());