const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry({ word: 'hello', tags: ['greeting'] });
lexicon.addEntry({ word: 'hi', tags: ['greeting'] });
lexicon.addEntry({ word: 'what', tags: ['question'] });
lexicon.addEntry({ word: 'is', tags: ['question'] });
lexicon.addEntry({ word: 'time', tags: ['query'] });

const classifier = new natural.BayesClassifier();
classifier.addDocument('hello', 'greeting');
classifier.addDocument('hi there', 'greeting');
classifier.addDocument('what is the time', 'query');

console.log(classifier.classify('hi')); // Output: greeting
console.log(classifier.classify('what is the current time')); // Output: query