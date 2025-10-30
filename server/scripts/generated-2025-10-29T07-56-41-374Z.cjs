const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  const doc = await nlp('What can you do for me?');
  
  console.log(`Tokens: ${doc.tokens.map(t => t.text).join(', ')}`);
  console.log(`Entities: ${doc.ents.map(e => e.label_ + ': ' + e.text).join(', ')}`);
})();