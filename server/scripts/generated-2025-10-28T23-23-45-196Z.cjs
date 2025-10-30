const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({ apikey: 'YOUR_API_KEY' }),
  });

  nlu.setServiceUrl('https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com');

  const text = 'Implement a natural language processing module that enables users to interact with me using everyday conversational language, making it easier and more intuitive to collaborate on tasks.';
  const analyzeParams = {
    text,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  nlu.analyze(analyzeParams)
    .then(analysisResults => {
      console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });
}

main();