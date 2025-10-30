const NLP = require('compromise');

console.log('Natural Language Processing Module');
console.log('---------------------------------');

const input = 'What can you do for me?';

const doc = NLP(input);
const sentences = doc.sentences().out('array');
const partsOfSpeech = doc.out('tags');

console.log(`Input: ${input}`);
console.log(`Sentences: ${sentences.join(', ')}`);
console.log(`Parts of Speech: ${partsOfSpeech.join(', ')}`);

if (doc.has('#Verb')) {
  console.log('You want to know what I can do for you!');
} else if (doc.has('#Noun')) {
  console.log('You mentioned a specific topic or object!');
} else {
  console.log('I didn\'t quite understand that. Please rephrase!');
}