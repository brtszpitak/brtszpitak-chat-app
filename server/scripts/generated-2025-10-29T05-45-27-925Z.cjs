const NaturalLanguageUnderstanding = require('stanford-corenlp');

const nlu = new NaturalLanguageUnderstanding({
  server: 'http://localhost:9000',
});

(async () => {
  const response = await nlu.process('What is the weather like today?');
  console.log(response);
})();