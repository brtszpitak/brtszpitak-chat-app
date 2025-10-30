const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  console.log('Loaded language model');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (input) => {
    try {
      const doc = await nlp(input.toString().trim());
      console.log(`Entities: ${[...doc.ents].map(e => e.text).join(', ')}`);
    } catch (err) {
      console.error(err);
    }
  });
})();