const fs = require('fs');
const path = require('path');

let conversationHistory = {};

if (fs.existsSync(path.join(__dirname, 'conversationHistory.json'))) {
  conversationHistory = JSON.parse(fs.readFileSync(path.join(__dirname, 'conversationHistory.json'), 'utf8'));
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput !== '') {
    console.log(`You said: ${userInput}`);
    if (!conversationHistory[userInput]) conversationHistory[userInput] = [];
    conversationHistory[userInput].push(new Date().toISOString());
    fs.writeFileSync(path.join(__dirname, 'conversationHistory.json'), JSON.stringify(conversationHistory, null, 2));
  }
});

process.stdin.on('end', () => {
  process.exit();
});