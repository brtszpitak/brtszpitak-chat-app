const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const { promisify } = require('util');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLP',
  iam_apikey_name: 'alice-nlp',
  version: '2022-04-07'
});

const analyzeText = promisify(nlu.analyze.bind(nlu));

async function processUserInput(input) {
  const params = {
    text: input,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {}
    }
  };

  try {
    const response = await analyzeText(params);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

processUserInput('What can you do for me, Alice?');