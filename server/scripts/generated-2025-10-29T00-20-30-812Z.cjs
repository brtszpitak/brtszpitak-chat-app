const axios = require('axios');
const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  console.log('NLP module loaded');

  async function processUserInput(input) {
    const doc = await nlp(input);
    const entities = doc.ents.map(entity => ({ text: entity.text, label: entity.label_ }));
    console.log(entities);
  }

  processUserInput('Hello, I need help with the Alice project');
})();