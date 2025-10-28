const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'NLU apikey',
  iam_apikey: '<YOUR_API_KEY>',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const analyzeParams = {
    text: line,
    features: {
      sentiment: {},
      entities: {}
    }
  };

  nlu.analyze(analyzeParams)
    .then(analysisResults => {
      console.log('Response:');
      console.log(`Sentiment: ${analysisResults.sentiment.document.label}`);
      analysisResults.entities.results.forEach(entity => {
        console.log(`Entity: ${entity.type} - ${entity.text}`);
      });
      rl.prompt();
    })
    .catch(err => {
      console.error('Error:', err);
      rl.prompt();
    });
});