```cjs
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

console.log('Welcome! You can interact with me using everyday conversational language.');

process.stdin.on('data', (input) => {
  const tokenizedInput = tokenizer.tokenize(input.toString().trim());
  console.log(`You said: ${tokenizedInput.join(' ')}`);

  // Very basic intent detection, just for demo purposes
  if (tokenizedInput.includes('what') && tokenizedInput.includes('time')) {
    console.log('The current time is:', new Date().toLocaleTimeString());
  } else {
    console.log("I didn't understand that. Please try again!");
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});
```