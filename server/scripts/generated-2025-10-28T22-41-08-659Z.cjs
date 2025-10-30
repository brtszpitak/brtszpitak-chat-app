fs.writeFileSync('conversationHistory.json', '{}');

const conversationHistory = JSON.parse(fs.readFileSync('conversationHistory.json'));

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const userInput = chunk.trim();
  console.log(`You: ${userInput}`);
  
  // Simple response for demonstration purposes
  const response = `Alice: I remember you said "${userInput}"`;
  console.log(response);
  
  conversationHistory[userInput] = response;
  fs.writeFileSync('conversationHistory.json', JSON.stringify(conversationHistory));
});