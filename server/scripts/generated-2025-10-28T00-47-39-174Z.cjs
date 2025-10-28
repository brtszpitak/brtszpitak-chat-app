const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLU',
  iam_apikey_name: 'alice-nlu',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
  version: '2021-08-01'
});

const text = 'I want to schedule a meeting with John at 2 PM tomorrow.';

naturalLanguageUnderstanding.analyze({
  text,
  features: {
    entities: {},
    keywords: {},
    sentiment: {},
    syntax: {}
  }
}, (error, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
});