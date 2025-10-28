const spacy = require('spacy');

async function main() {
  const nlp = await spacy.load('en_core_web_sm');
  const doc = await nlp('What is the weather like today?');
  console.log(doc.text);
  for (const entity of doc.ents) {
    console.log(entity.text, entity.label_);
  }
}

main();