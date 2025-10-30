const NLP = require('compromise');

const respond = (input) => {
  const doc = NLP(input);
  if (doc.has('# Verb')) {
    console.log(`You want to ${doc.match('# Verb').text()}`);
  } else {
    console.log('I did not understand that.');
  }
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => respond(input.trim()));
console.log('Talk to me!');