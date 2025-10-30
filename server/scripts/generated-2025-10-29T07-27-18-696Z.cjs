const NLP = require('compromise');

async function processUserInput(input) {
  const doc = NLP(input);
  if (doc.match('ask * about *').found) {
    const question = doc.match('ask * about *')[0].text();
    console.log(`You asked: ${question}`);
  } else if (doc.match('* give * command').found) {
    const command = doc.match('* give * command')[0].text();
    console.log(`You want to execute: ${command}`);
  } else {
    console.log('Unable to understand your request.');
  }
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', async (input) => {
  await processUserInput(input.trim());
});