const NLP = require('compromise');

const nlp = NLP();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const doc = nlp(input.trim());
  if (doc.verbs().found) {
    console.log(`You want to ${doc.verbs().text()}`);
  } else if (doc.questions().found) {
    console.log(`You're asking: ${doc.text()}`);
  } else {
    console.log('I didn\'t understand that.');
  }
});