const fs = require('fs');
const path = require('path');

let conversationHistory = [];
let powershellCommands = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'conversation_history.json'), 'utf8');
  conversationHistory = JSON.parse(data);
} catch (err) {}

function analyzeConversation() {
  for (const entry of conversationHistory) {
    const keywords = entry.text.toLowerCase().split(' ');
    for (const keyword of keywords) {
      if (!powershellCommands[keyword]) powershellCommands[keyword] = [];
      powershellCommands[keyword].push(entry.suggestedCommand);
    }
  }
}

function suggestCommands(topic) {
  topic = topic.toLowerCase();
  let suggestions = [];
  for (const keyword in powershellCommands) {
    if (topic.includes(keyword)) {
      suggestions.push(...powershellCommands[keyword]);
    }
  }
  return [...new Set(suggestions)];
}

analyzeConversation();

console.log('Context-aware PowerShell command suggestion system ready!');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const topic = input.trim();
  if (topic) {
    const suggestions = suggestCommands(topic);
    console.log(`Suggested PowerShell commands for "${topic}":`);
    for (const command of suggestions) {
      console.log(command);
    }
  }
});