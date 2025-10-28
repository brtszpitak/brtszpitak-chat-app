const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({
      apikey: 'YOUR_API_KEY'
    })
  });

  nlu.setServiceUrl('https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com');

  const text = 'I want to collaborate with Alice using everyday conversational phrases.';
  const analyzeParams = {
    text,
    features: {
      sentiment: {},
      entities: {}
    }
  };

  try {
    const response = await nlu.analyze(analyzeParams);
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();