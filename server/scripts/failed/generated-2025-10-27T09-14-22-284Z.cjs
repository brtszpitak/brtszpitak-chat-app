const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

let knowledgeGraph = {};

if (fs.existsSync("knowledge-graph.json")) {
  knowledgeGraph = JSON.parse(fs.readFileSync("knowledge-graph.json", "utf8"));
}

function saveKnowledgeGraph() {
  fs.writeFileSync("knowledge-graph.json", JSON.stringify(knowledgeGraph, null, 2));
}

function getUserNode(userId) {
  if (!knowledgeGraph[userId]) {
    knowledgeGraph[userId] = { preferences: {}, habits: [], interactions: [] };
    saveKnowledgeGraph();
  }
  return knowledgeGraph[userId];
}

function storePreference(userId, preferenceName, preferenceValue) {
  const userNode = getUserNode(userId);
  userNode.preferences[preferenceName] = preferenceValue;
  saveKnowledgeGraph();
}

function retrievePreference(userId, preferenceName) {
  const userNode = getUserNode(userId);
  return userNode.preferences[preferenceName];
}

function addHabit(userId, habit) {
  const userNode = getUserNode(userId);
  userNode.habits.push(habit);
  saveKnowledgeGraph();
}

function getHabits(userId) {
  const userNode = getUserNode(userId);
  return userNode.habits;
}

function storeInteraction(userId, interaction) {
  const userNode = getUserNode(userId);
  userNode.interactions.push(interaction);
  saveKnowledgeGraph();
}

function getInteractions(userId) {
  const userNode = getUserNode(userId);
  return userNode.interactions;
}

const userId = uuidv4();

storePreference(userId, "language", "en");
addHabit(userId, "dailyCoffee");
storeInteraction(userId, { type: "query", query: "What is the weather like?" });

console.log(retrievePreference(userId, "language"));
console.log(getHabits(userId));
console.log(getInteractions(userId));
