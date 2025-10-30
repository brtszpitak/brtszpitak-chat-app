const NaturalLanguageUnderstanding = require('stanford-corenlp');

(async () => {
  const nlu = new NaturalLanguageUnderstanding({
    server: 'http://localhost:9000',
  });

  await nlu.parse('What can you do for me?');
  console.log(nlu.sentences[0].basicDependencies);
})();