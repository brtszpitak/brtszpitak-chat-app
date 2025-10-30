const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  const userInput = 'Integrate a natural language processing module';
  const doc = await nlp(userInput);
  console.log(`Entities: ${[...doc.ents].map(entity => entity.text).join(', ')}`);
  console.log(`Part-of-speech tags: ${[...doc].map(token => token.pos_).join(', ')}`);
})();