const fs = require('fs');
const path = require('path');

let conversationHistory = [];

function logInteraction(interaction) {
  conversationHistory.push({ date: new Date().toISOString(), interaction });
  fs.writeFileSync(path.join(__dirname, 'conversation_history.json'), JSON.stringify(conversationHistory));
}

function getSummary() {
  return conversationHistory.map((entry) => `${entry.date}: ${entry.interaction}`).join('\n');
}

console.log('Welcome to the conversation!');
while (true) {
  const userInput = prompt('You: ');
  logInteraction(userInput);
  console.log(`Summary:\n${getSummary()}`);
}