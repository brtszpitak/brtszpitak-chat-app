fs = require('fs');
const filePath = 'conversation-context.json';

let context = {};

try {
  context = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    console.log(`You: ${message}`);
    const response = `AI: Hello! I'm happy to chat with you. Our conversation context is: ${JSON.stringify(context)}`;
    console.log(response);
    context[Date.now()] = { user: message, ai: response };
  }
});

process.on('exit', () => {
  fs.writeFileSync(filePath, JSON.stringify(context));
});