const nl = require('nlp-compromise');

function processText(text) {
  const doc = nl.text(text);
  console.log(`Part of speech tagging: ${JSON.stringify(doc.tags, null, 2)}`);
  console.log(`Named entity recognition: ${JSON.stringify(doc.entities, null, 2)}`);
}

processText("I'd like to implement a natural language processing module.");