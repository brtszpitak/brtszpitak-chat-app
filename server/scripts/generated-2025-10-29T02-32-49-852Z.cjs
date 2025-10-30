console.log('Welcome to Conversation History!');
const conversationHistory = [];
process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput === 'history') {
    console.log('Conversation History:');
    conversationHistory.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry}`);
    });
  } else if (userInput === 'exit') {
    process.exit(0);
  } else {
    console.log(`You said: ${userInput}`);
    conversationHistory.push(userInput);
  }
});