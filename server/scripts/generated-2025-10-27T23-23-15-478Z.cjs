const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLU',
  iam_apikey_name: 'alice-nlu',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
  version: '2021-08-01'
});

const text = 'What is the weather like today?';
const analyzeParams = {
  text,
  features: {
    sentiment: {},
    entities: {}
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch(err => {
    console.error('error:', err);
  });