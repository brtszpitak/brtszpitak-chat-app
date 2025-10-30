const fs = require('fs');
let convHistory = {};

try {
  convHistory = JSON.parse(fs.readFileSync('convHistory.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    console.log(`You: ${message}`);
    const response = getResponse(message, convHistory);
    console.log(`AI: ${response}`);
    updateConvHistory(convHistory, message, response);
  }
});

process.stdin.on('end', () => {
  fs.writeFileSync('convHistory.json', JSON.stringify(convHistory));
});

function getResponse(message, convHistory) {
  // TO DO: implement AI logic to respond based on conversation history
  return 'This is a dummy response.';
}

function updateConvHistory(convHistory, message, response) {
  const timestamp = new Date().toISOString();
  convHistory[timestamp] = { message, response };
}