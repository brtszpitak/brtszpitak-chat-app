const readline = require('readline');
const { spawn } = require('child_process');

const nlp = require('compromise'); // assuming compromise as the NLP library

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const doc = nlp(line);
  if (doc.verbs().length > 0) {
    const verb = doc.verbs().text();
    if (verb === 'run') {
      const command = line.replace(verb, '').trim();
      const powershell = spawn('powershell.exe', ['-Command', command]);
      powershell.stdout.on('data', (data) => {
        console.log(`Powershell: ${data}`);
      });
      powershell.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });
    } else {
      console.log(`Unknown verb: ${verb}`);
    }
  } else {
    console.log('No verb detected');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});