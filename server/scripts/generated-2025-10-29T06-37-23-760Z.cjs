const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const { promisify } = require('util');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'My NLU Api key',
  iam_apikey: '<YOUR_API_KEY>',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const analyzeText = promisify(nlu.analyze.bind(nlu));

async function processUserInput(userInput) {
  const params = {
    text: userInput,
    features: {
      sentiment: {},
      entities: {}
    }
  };

  try {
    const response = await analyzeText(params);
    console.log('Sentiment:', response.sentiment.document.label);
    console.log('Entities:');
    response.entities.results.forEach(entity => console.log(`- ${entity.type}: ${entity.text}`));
  } catch (err) {
    console.error(err);
  }
}

processUserInput('I love this AI collaboration tool!');