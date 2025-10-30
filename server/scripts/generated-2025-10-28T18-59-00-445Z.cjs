const NLP = require('compromise');

console.log('Welcome! I understand everyday language. Type something:');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = NLP(input.trim());
  console.log(`You said: ${doc.text()}`);
  if (doc.has('#Verb')) {
    const verb = doc.match('#Verb').text();
    console.log(`You want to ${verb}.`);
  }
  if (doc.has('what is')) {
    const question = doc.match('what is').next().text();
    console.log(`You asked about ${question}. I'm still learning...`);
  }
});