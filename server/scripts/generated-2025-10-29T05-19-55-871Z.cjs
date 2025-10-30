const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const { promisify } = require('util');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Node.js SDK',
  iam_apikey_name: 'node-sdk',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
  version: '2022-04-07'
});

const analyze = promisify(nlu.analyze.bind(nlu));

async function main() {
  const params = {
    text: 'I suggest implementing a natural language processing module',
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {}
    }
  };

  try {
    const results = await analyze(params);
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();