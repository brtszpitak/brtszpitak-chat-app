console.log('Hello! I\'m ready to assist you in natural language. What can I help you with?');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();
  if (command.startsWith('what')) {
    console.log('I can help you with various tasks. Please be more specific.');
  } else if (command.startsWith('list')) {
    console.log('Here are some examples of what I can do:');
    console.log('- Create a new folder');
    console.log('- Delete a file');
    console.log('- Open an application');
  } else if (command.includes('create') && command.includes('folder')) {
    const folderName = command.replace('create a new folder named ', '');
    console.log(`Creating a new folder: ${folderName}`);
    // TO DO: implement actual folder creation using Windows commands
  } else {
    console.log('I didn\'t understand that. Please try again.');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});