const NLP = require('compromise');

console.log("Welcome! You can now interact with me using everyday language.");

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const nlp = NLP(input.trim());
  const intent = nlp.match('#Verb #Noun').out('array')[0];

  if (intent) {
    console.log(`You want to ${intent[0].text} the ${intent[1].text}.`);
  } else {
    console.log("I didn't understand that. Try rephrasing your request.");
  }
});

process.stdin.on('end', () => process.stdout.write(''));