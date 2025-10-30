const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const { spawn } = require('child_process');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: 'Alice NLP',
  iam_apikey_name: 'alice-nlp',
  iam_role_crn: 'YOUR_IBM_CLOUD_ROLE_CRN',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const processCmd = (cmd) => {
  const child = spawn('powershell.exe', ['-Command', cmd]);
  child.stdout.on('data', (data) => console.log(`Powershell Output: ${data}`));
  child.stderr.on('data', (data) => console.error(`Powershell Error: ${data}`));
};

const analyzeText = (text) => {
  const params = {
    'text': text,
    'features': {
      'entities': {},
      'keywords': {}
    }
  };

  nlu.analyze(params, (err, response) => {
    if (err) console.error(err);
    else {
      const entities = response.entities;
      const keywords = response.keywords;

      for (const entity of entities) {
        if (entity.type === 'System.Command') {
          processCmd(entity.text);
        }
      }

      for (const keyword of keywords) {
        if (keyword.relevance > 0.5) {
          console.log(`Detected keyword: ${keyword.text}`);
        }
      }
    }
  });
};

analyzeText('Run the PowerShell command to list all files in the current directory.');