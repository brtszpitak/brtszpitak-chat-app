const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.setPrompt('What can I help you with? ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what is my')) {
    const query = command.replace('what is my ', '');
    switch (query) {
      case 'username':
        console.log(require('os').userInfo().username);
        break;
      default:
        console.log(`I'm not sure about that. Can you ask something else?`);
    }
  } else if (command.startsWith('list')) {
    const dir = command.replace('list ', '');
    require('fs').readdirSync(dir).forEach(file => console.log(file));
  } else {
    console.log(`Sorry, I didn't understand that. Try asking a question or giving a command.`);
  }
  rl.prompt();
}).on('close', () => process.exit(0));