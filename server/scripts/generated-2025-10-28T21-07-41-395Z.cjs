const NLP = require('compromise');

console.log("Hello! I'm here to help. Ask me anything or give a command.");

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = NLP(input.trim());
  if (doc.match("what *").found) console.log("You asked a question!");
  else if (doc.match("* command *").found) console.log("You gave a command!");
  else console.log("I didn't understand that. Try again?");
});