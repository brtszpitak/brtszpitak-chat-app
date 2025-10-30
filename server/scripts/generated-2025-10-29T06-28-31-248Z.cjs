const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'NLU apikey',
  iam_apikey: '<YOUR_API_KEY>',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const params = {
    text: line,
    features: {
      entities: {},
      keywords: {}
    }
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});