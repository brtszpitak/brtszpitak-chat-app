const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'NLP API key',
  iam_apikey: '<API_KEY>',
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
      sentiment: {},
      entities: {}
    }
  };

  nlu.analyze(params, (err, response) => {
    if (err) console.error(err);
    else {
      console.log(`Sentiment: ${response.sentiment.document.label}`);
      console.log('Entities:');
      response.entities.entities.forEach(entity => console.log(`- ${entity.type}: ${entity.text}`));
    }
  });

  rl.prompt();
});