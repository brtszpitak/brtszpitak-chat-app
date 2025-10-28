const fs = require('fs');
let memory = {};

if (fs.existsSync('memory.json')) {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const conversation = input.trim();
  if (!conversation) return;

  if (!memory.conversations) memory.conversations = [];
  memory.conversations.push(conversation);

  fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));

  console.log(`You said: ${conversation}`);

  // TO DO: implement natural language processing to identify relevant topics and follow-ups
  // For now, just recall the last conversation
  if (memory.conversations.length > 1) {
    const lastConversation = memory.conversations[memory.conversations.length - 2];
    console.log(`I remember you said: ${lastConversation}`);
  }
});

process.stdin.on('end', () => process.exit());