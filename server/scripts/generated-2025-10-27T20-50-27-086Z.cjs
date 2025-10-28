const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what is my')) {
    const query = command.replace('what is my ', '');
    switch (query) {
      case 'username':
        console.log(process.env.USERNAME);
        break;
      default:
        console.log(`I'm not sure about that.`);
    }
  } else if (command === 'list files') {
    require('child_process').exec('dir', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(stdout);
    });
  } else {
    console.log(`I didn't understand that. Try again!`);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});