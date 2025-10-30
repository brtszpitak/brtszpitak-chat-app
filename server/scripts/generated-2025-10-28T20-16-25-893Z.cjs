console.log('Initializing memory feature...');
const fs = require('fs');
const path = require('path');

let dbPath = path.join(__dirname, 'memory.json');
let db = {};

try {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (e) {}

function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function recall(key) {
  return db[key];
}

function remember(key, value) {
  db[key] = value;
  saveDb();
}

remember('lastConversation', 'Hello! How can I assist you today?');
console.log(recall('lastConversation'));