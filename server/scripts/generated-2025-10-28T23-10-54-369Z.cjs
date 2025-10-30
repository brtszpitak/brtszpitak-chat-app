const fs = require('fs');
const dbFile = 'alice-db.json';

let db = {};

try {
  db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
} catch (e) {}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function recall(topic) {
  return db[topic];
}

function remember(topic, info) {
  db[topic] = info;
  saveDb();
}

remember(' alice-project-improvement', 'Integrate a knowledge graph or database to store and retrieve information from previous conversations');

console.log(recall('alice-project-improvement'));