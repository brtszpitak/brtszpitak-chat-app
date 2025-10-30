fs.writeFileSync('conversations.json', '{}');

const conversations = JSON.parse(fs.readFileSync('conversations.json'));

process.stdin.setEncoding('utf8');
process.stdout.write('You: ');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput !== '') {
    conversations[Date.now()] = userInput;
    fs.writeFileSync('conversations.json', JSON.stringify(conversations, null, 2));
    process.stdout.write(`AI: I remember you said: ${userInput}\nYou: `);
  }
});

process.on('SIGINT', () => {
  console.log('\nExiting...');
  process.exit();
});