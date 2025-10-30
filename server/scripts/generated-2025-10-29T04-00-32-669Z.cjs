const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const lexer = new natural.Lexicon();

let commands = {
  'what is my name': 'echo Your name is Alice',
  'list files': 'dir',
  'create file': 'type nul > newfile.txt'
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  let tokenized = tokenizer.tokenize(input.toLowerCase());
  let stemmed = tokenized.map((word) => stemmer.stem(word));
  let command = lexer.match(stemmed.join(' '));

  if (commands[command]) {
    console.log(`Running command: ${commands[command]}`);
    require('child_process').exec(commands[command], (error, stdout, stderr) => {
      if (error) console.error(`Error: ${error.message}`);
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    });
  } else {
    console.log('Unknown command');
  }
});