const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({'word':'hello', 'tags':['greeting']});
lexicon.addEntry({'word':'hi', 'tags':['greeting']});
lexicon.addEntry({'word':'what', 'tags':['question']});
lexicon.addEntry({'word':'time', 'tags':['query']});
lexicon.addEntry({'word':'is', 'tags':['auxiliary']});

const classifier = new natural.BayesClassifier();

classifier.addDocument('hello how are you?', 'greeting');
classifier.addDocument('hi what is the time?', 'question');

function processInput(input) {
  const tokens = tokenizer.tokenize(input);
  let intention = '';
  for (let token of tokens) {
    const entry = lexicon.lookup(token);
    if (entry && entry.tags.length > 0) {
      intention += ` ${entry.tags[0]}`;
    }
  }
  const classification = classifier.classify(input);
  console.log(`Input: ${input}, Intention: ${intention.trim()}, Classification: ${classification}`);
}

processInput('hello how are you?');
processInput('hi what is the time?');