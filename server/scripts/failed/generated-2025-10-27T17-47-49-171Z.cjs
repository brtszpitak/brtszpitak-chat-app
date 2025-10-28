const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addVerb('ask', 'inquire about');
lexer.addVerb('give', 'provide');
lexer.addCommand('what', 'query');
lexer.addCommand('do', 'execute');

process.stdin.setEncoding('utf8');
process.stdout.write('Natural Language Interface\n> ');
process.stdin.on('data', (input) => {
  const tokens = tokenizer.tokenize(input.toString().trim());
  let verb, command;
  for (let token of tokens) {
    if (lexer.isVerb(token)) {
      verb = lexer.get Verb(token);
    } else if (lexer.isCommand(token)) {
      command = lexer.getCommand(token);
    }
  }
  if (verb && command) {
    switch (command) {
      case 'query':
        process.stdout.write(`You asked: ${input.toString().trim()}\n> `);
        break;
      case 'execute':
        try {
          eval(input.toString().trim());
          process.stdout.write('Executed successfully\n> ');
        } catch (e) {
          process.stdout.write(`Error executing command: ${e.message}\n> `);
        }
        break;
    }
  } else {
    process.stdout.write('Invalid input. Try again!\n> ');
  }
});