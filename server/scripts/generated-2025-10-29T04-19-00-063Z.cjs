const fs = require('fs');
const readline = require('readline');

let conversationHistory = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  conversationHistory.push(line.trim());
  const lastLine = conversationHistory[conversationHistory.length - 1];
  if (lastLine.startsWith('suggest')) {
    const commandTopics = ['powershell', 'nodejs', 'javascript'];
    const suggestions = commandTopics.filter(topic => lastLine.includes(topic));
    console.log(`Suggestions: ${suggestions.join(', ')}`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});