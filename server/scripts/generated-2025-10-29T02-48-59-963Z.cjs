const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${input}`);
  console.log(`Tokens: ${tokens.join(', ')}`);

  // Simple intent detection
  if (tokens.includes('hello')) {
    console.log('Hello!');
  } else if (tokens.includes('help')) {
    console.log('I can assist you with tasks. What do you need help with?');
  } else {
    console.log("I didn't understand that. Please try again.");
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!\n');
});