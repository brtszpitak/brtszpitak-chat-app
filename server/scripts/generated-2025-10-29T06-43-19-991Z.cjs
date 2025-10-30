const fs = require('fs');
let convHistory = {};

if (fs.existsSync('convHistory.json')) {
  convHistory = JSON.parse(fs.readFileSync('convHistory.json', 'utf8'));
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput === ':save') {
    fs.writeFileSync('convHistory.json', JSON.stringify(convHistory, null, 2));
    console.log('Conversation history saved.');
  } else if (userInput.startsWith(':recall ')) {
    const key = userInput.substring(8);
    if (convHistory[key]) {
      console.log(convHistory[key]);
    } else {
      console.log('No conversation found for the given key.');
    }
  } else {
    convHistory[Date.now()] = userInput;
    console.log(`You: ${userInput}`);
  }
});

process.stdin.on('end', () => {
  fs.writeFileSync('convHistory.json', JSON.stringify(convHistory, null, 2));
});