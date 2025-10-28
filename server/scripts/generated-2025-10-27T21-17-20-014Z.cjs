const nltk = require('nltk');
const spacy = require('spacy');

(async () => {
  await spacy.load('en_core_web_sm');
  const nlp = spacy.processors['en_core_web_sm'];
  
  console.log('NLP Module Initialized. Type a phrase to analyze:');
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (input) => {
    const phrase = input.trim();
    if (phrase !== '') {
      try {
        const doc = nlp(phrase);
        console.log(`Entities: ${doc.ents.map(e => e.text).join(', ')}`);
        console.log(`Part-of-speech tags: ${doc.map(t => t.pos_).join(', ')}`);
      } catch (e) {
        console.error(`Error processing phrase: ${e.message}`);
      }
    }
  });
})();