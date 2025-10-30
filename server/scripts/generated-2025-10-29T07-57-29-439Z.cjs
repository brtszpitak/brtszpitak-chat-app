const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  console.log('Loaded Spacy NLP model');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (input) => {
    const doc = await nlp(input.toString().trim());
    const intent = doc.ents.find(ent => ent.label_ === 'PRODUCT')?.text;
    if (intent) console.log(`You want to use ${intent} for your task.`);
    else console.log('I did not understand your request.');
  });
})();