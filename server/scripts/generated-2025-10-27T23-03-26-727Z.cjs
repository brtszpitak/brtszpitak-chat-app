const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: 'YOUR_API_KEY',
  version: '2022-04-07'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const analyzeParams = {
    text: line.trim(),
    features: {
      entities: {},
      keywords: {}
    }
  };

  nlu.analyze(analyzeParams)
    .then(analysisResults => {
      console.log(JSON.stringify(analysisResults, null, 2));
      rl.prompt();
    })
    .catch(err => {
      console.error('Error:', err);
      rl.prompt();
    });
}).on('close', () => {
  process.exit(0);
});