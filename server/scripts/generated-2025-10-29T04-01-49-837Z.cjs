const readline = require('readline');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('What would you like to do? ');
rl.prompt();

rl.on('line', (line) => {
  const tokens = tokenizer.tokenize(line);
  const command = lexer.categorize(tokens).best;
  
  switch(command.label) {
    case 'list_files':
      console.log('Proposed PowerShell command: dir');
      break;
    case 'create_file':
      console.log('Proposed PowerShell command: New-Item -ItemType File -Path ./newfile.txt');
      break;
    // Add more cases for other commands
    default:
      console.log(`Sorry, I didn't understand "${line}"`);
  }
  
  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});