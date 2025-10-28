const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({word: 'hello', tags: ['greeting']});
lexicon.addEntry({word: 'hi', tags: ['greeting']});
lexicon.addEntry({word: 'what', tags: ['question']});
lexicon.addEntry({word: 'is', tags: ['question']});
lexicon.addEntry({word: 'time', tags: ['query']});

const classify = (input) => {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  let intent = null;
  let entities = [];

  for (let token of tokens) {
    const entry = lexicon.lookup(token);
    if (entry && entry.tags.includes('greeting')) {
      intent = 'greeting';
    } else if (entry && entry.tags.includes('question')) {
      intent = 'query';
    }
    if (entry && entry.tags.includes('query')) {
      entities.push(token);
    }
  }

  return { intent, entities };
};

const userInput = process.argv[2];
if (!userInput) {
  console.log('Please provide input');
} else {
  const result = classify(userInput);
  console.log(`Intent: ${result.intent}, Entities: ${result.entities.join(', ')}`);
}