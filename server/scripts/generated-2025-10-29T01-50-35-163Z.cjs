const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.setPrompt('You: ');
rl.prompt();
rl.on('line', (line) => {
  const command = line.trim().toLowerCase();
  if (command.startsWith('what is my')) {
    console.log(`Your current directory is ${process.cwd()}`);
  } else if (command === 'list files') {
    require('child_process').exec('dir', (error, stdout, stderr) => {
      if (error) return console.error(error);
      console.log(stdout);
    });
  } else {
    console.log(`I don't understand '${line}'`);
  }
  rl.prompt();
}).on('close', () => process.exit(0));