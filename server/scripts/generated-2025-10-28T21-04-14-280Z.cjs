const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const parser = new natural.Lexicon();

parser.addLexer({
  category: 'windows_commands',
  files: ['verbs.txt', 'nouns.txt']
});

const lexicon = parser.getLexicon();
const jsgf = parser.jsgf();

const askUser = () => {
  process.stdout.write('> ');
  process.stdin.once('data', data => {
    const input = data.toString().trim();
    const tokenizedInput = tokenizer.tokenize(input);
    const result = jsgf.parse(tokenizedInput);

    if (result.length > 0) {
      const command = result[0].getText();
      console.log(`Executing Windows command: ${command}`);
      require('child_process').exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`STDERR: ${stderr}`);
          return;
        }
        console.log(stdout);
      });
    } else {
      console.log('Unknown command. Please try again.');
    }

    askUser();
  });
};

askUser();