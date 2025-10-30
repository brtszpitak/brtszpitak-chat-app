const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addLexer('PowerShell', {
  'list files': 'Get-ChildItem',
  'show calendar': 'Get-Date -Format "yyyy-MM-dd"',
  'what time is it': 'Get-Date -Format "hh:mm tt"'
});

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  let command = '';
  for (let i = 0; i < tokens.length; i++) {
    command += lexer.tokenize(tokens[i]).reduce((a, b) => a + ' ' + b, '');
  }
  console.log(`You want to execute: ${command}`);
  // TO DO: Execute the PowerShell command
});