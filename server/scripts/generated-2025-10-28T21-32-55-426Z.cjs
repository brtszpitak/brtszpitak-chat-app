const NaturalLanguageUnderstanding = require('stanford-corenlp');

const nlu = new NaturalLanguageUnderstanding({
  annotators: ['tokenize', 'ssplit', 'pos', 'lemma', 'ner', 'parse', 'dcoref'],
  outputFormat: 'json'
});

process.stdin.setEncoding('utf8');
process.stdin.on('data', async (input) => {
  try {
    const result = await nlu.annotate(input.toString().trim());
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
});