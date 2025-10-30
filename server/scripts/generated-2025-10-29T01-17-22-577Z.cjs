const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'NLP key',
  iam_apikey: '<YOUR_API_KEY>',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome to the conversational AI! Type something to get started.');

rl.on('line', (input) => {
  const analyzeParams = {
    text: input,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {}
    }
  };

  nlu.analyze(analyzeParams)
    .then(analysisResults => {
      console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
      console.log('Error:', err);
    });
}).on('close', () => {
  process.exit(0);
});