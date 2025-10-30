const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (chunk) => {
    try {
      const doc = await nlp(chunk.toString().trim());
      console.log(`Entities: ${[...doc.ents].map(e => e.text).join(', ')}`);
      console.log(`Intent: ${doc.cats}`);
    } catch (err) {
      console.error(err);
    }
  });
})();