const readline = require('readline');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLP',
  iam_apikey_name: 'alice-nlp',
  iam_role_crn: 'YOUR_IBM_CLOUD_IAM_ROLE_CRN',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Alice > ');
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
    .then(response => {
      console.log(JSON.stringify(response, null, 2));
    })
    .catch(err => {
      console.error('Error:', err);
    });

  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});