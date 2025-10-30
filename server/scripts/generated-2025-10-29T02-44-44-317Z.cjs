const natural = require('natural');
const { spawn } = require('child_process');

const tokenizer = new natural.WordTokenizer();
const parser = new natural.LancasterStemmer();

let commands = {
  'what is my username': 'whoami',
  'show me files in the current directory': 'dir',
  'create a new folder named': (phrase) => `mkdir ${phrase}`,
  'delete the file': (phrase) => `del ${phrase}`
};

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  let tokens = tokenizer.tokenize(input.toLowerCase());
  let phrase = parser.attach(tokens);

  for (let command in commands) {
    if (phrase.includes(command)) {
      let cmd = commands[command];
      if (typeof cmd === 'function') {
        cmd = cmd(phrase.replace(command, '').trim());
      }
      const powershell = spawn('powershell.exe', ['-Command', cmd]);
      powershell.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      powershell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      powershell.on('close', (code) => {
        console.log(`powershell process exited with code ${code}`);
      });
    }
  }
});