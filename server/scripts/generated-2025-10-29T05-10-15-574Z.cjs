const NLP = require('compromise');

function processQuery(query) {
  const doc = NLP(query);
  const nouns = doc.nouns().data();
  const verbs = doc.verbs().data();

  console.log(`Detected nouns: ${nouns.map(n => n.text).join(', ')}`);
  console.log(`Detected verbs: ${verbs.map(v => v.text).join(', ')}`);
}

processQuery('I suggest implementing a natural language processing module');