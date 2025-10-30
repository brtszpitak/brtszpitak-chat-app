console.log('NLP Module Prototype');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what is my')) {
    console.log(`Your current directory is ${process.cwd()}`);
  } else if (command === 'list files') {
    console.log('Listing files...');
    require('child_process').exec('dir', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else {
    console.log(`Sorry, I didn't understand '${command}'.`);
  }
  rl.prompt();
});