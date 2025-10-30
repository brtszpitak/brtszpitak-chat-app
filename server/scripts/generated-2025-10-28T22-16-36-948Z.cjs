const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

function processInput(input) {
  const tokens = tokenizer.tokenize(input);
  const taggedTokens = lexer.addDefinitions(tokens);

  for (let i = 0; i < taggedTokens.length; i++) {
    if (taggedTokens[i].tag === 'NN' && taggedTokens[i + 1] && taggedTokens[i + 1].tag === 'VBZ') {
      console.log(`You asked a question about ${taggedTokens[i].token}!`);
    } else if (taggedTokens[i].tag === 'VB' && taggedTokens[i + 1] && taggedTokens[i + 1].tag === 'NN') {
      console.log(`You want to perform an action on ${taggedTokens[i + 1].token}!`);
    }
  }
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  processInput(input.trim());
});

console.log('Type something to interact with me...');