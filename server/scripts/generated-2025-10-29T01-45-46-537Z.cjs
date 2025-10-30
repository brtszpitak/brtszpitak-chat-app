const NLP = require('compromise');

console.log('Welcome to Alice! Ask me anything.');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = NLP(input.trim());
  const intent = doc.match('# Verb').out('array')[0];
  if (intent) {
    console.log(`You want to ${intent.text}`);
  } else {
    console.log('I didn\'t understand that. Try again!');
  }
});