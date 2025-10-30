const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry('what', 'WH_Query');
lexicon.addEntry('is', 'LinkingVerb');
lexicon.addEntry('the', 'Article');
lexicon.addEntry('time', 'Noun');
lexicon.addEntry('?', 'Punctuation');

const sentence = 'What is the time?';
const tokens = tokenizer.tokenize(sentence);

console.log(tokens);
console.log(natural.posTagger(taggable(tokens)));