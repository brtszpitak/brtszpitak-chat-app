const readline = require('readline');
const childProcess = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do? ');
rl.prompt();

rl.on('line', (line) => {
  const commandMap = {
    'what is the current directory': 'pwd',
    'list files and folders': 'dir',
    'create a new folder called <folderName>': (folderName) => `mkdir ${folderName}`,
    'delete file <fileName>': (fileName) => `del /f ${fileName}`,
    // add more commands here
  };

  let command = line.trim().toLowerCase();
  for (const phrase in commandMap) {
    const regex = new RegExp(phrase.replace(/<([^<>]+)>/g, '(.*?)'));
    const match = command.match(regex);
    if (match) {
      let params = match.slice(1);
      if (typeof commandMap[phrase] === 'function') {
        command = commandMap[phrase](...params);
      } else {
        command = commandMap[phrase];
      }
      break;
    }
  }

  childProcess.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.log(stdout);
    }
    rl.prompt();
  });
}).on('close', () => {
  process.exit(0);
});