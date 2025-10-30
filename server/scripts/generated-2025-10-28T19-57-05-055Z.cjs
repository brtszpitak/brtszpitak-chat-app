const fs = require('fs');
let convoHistory = {};

try {
  convoHistory = JSON.parse(fs.readFileSync('convoHistory.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput !== '') {
    console.log(`You: ${userInput}`);
    const response = `AI: I remember you said ${convoHistory[userInput] || 'nothing'}.`;
    convoHistory[userInput] = userInput;
    fs.writeFileSync('convoHistory.json', JSON.stringify(convoHistory, null, 2));
    console.log(response);
  }
});

process.stdin.on('end', () => {
  process.exit();
});