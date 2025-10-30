const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const { username, password } = require('./credentials.json');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLU',
  iam_apikey_name: 'alice-nlu',
  username,
  password,
});

process.stdin.setEncoding('utf8');

process.stdin.on('data', async (input) => {
  const params = {
    text: input.toString(),
    features: {
      sentiment: {},
      entities: {}
    }
  };

  try {
    const response = await nlu.analyze(params);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
});