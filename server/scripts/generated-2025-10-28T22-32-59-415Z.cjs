const fs = require('fs');
let conversationHistory = {};

try {
  const storedHistory = fs.readFileSync('./conversation-history.json', 'utf8');
  conversationHistory = JSON.parse(storedHistory);
} catch (err) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput !== '') {
    console.log(`You: ${userInput}`);
    const response = `AI: I'll remember that for next time!`;
    conversationHistory[Object.keys(conversationHistory).length] = { user: userInput, ai: response };
    fs.writeFileSync('./conversation-history.json', JSON.stringify(conversationHistory));
    console.log(response);
  }
});

process.stdin.on('end', () => {
  process.exit();
});