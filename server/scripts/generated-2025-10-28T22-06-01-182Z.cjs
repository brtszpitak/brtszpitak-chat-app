const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'NLP API key',
  iam_apikey: '<YOUR_API_KEY>',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome to the conversational AI! Type your query and press Enter.');

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
    const analyzeParams = {
      text: line,
      features: {
        sentiment: {},
        entities: {}
      }
    };

    nlu.analyze(analyzeParams)
      .then(analysisResults => {
        console.log(`Sentiment: ${analysisResults.sentiment.document.label}`);
        console.log('Entities:');
        analysisResults.entities.forEach(entity => {
          console.log(`  - ${entity.type}: ${entity.text}`);
        });
        rl.prompt();
      })
      .catch(err => {
        console.error('Error:', err);
        rl.prompt();
      });
  }
});

rl.on('close', () => {
  process.exit(0);
});