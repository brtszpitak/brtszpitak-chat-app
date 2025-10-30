const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge_graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge_graph.json'), JSON.stringify(knowledgeGraph));
}

function getUserPreference(userId, preferenceKey) {
  return knowledgeGraph[userId] ? knowledgeGraph[userId][preferenceKey] : null;
}

function setUserPreference(userId, preferenceKey, value) {
  if (!knowledgeGraph[userId]) knowledgeGraph[userId] = {};
  knowledgeGraph[userId][preferenceKey] = value;
  saveKnowledgeGraph();
}

function respondToUser(userId, message) {
  const userPreferences = knowledgeGraph[userId];
  // TO DO: implement personalized response logic based on user preferences
  console.log(`Responding to ${userId}: ${message}`);
}

const userId = 'example_user';
setUserPreference(userId, 'favorite_color', 'blue');
console.log(getUserPreference(userId, 'favorite_color')); // outputs: blue

respondToUser(userId, 'Hello!');