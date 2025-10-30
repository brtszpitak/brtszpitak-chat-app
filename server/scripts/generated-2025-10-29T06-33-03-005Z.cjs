const nlptool = require('compromise');
const nlp = nlptool();

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const doc = nlp(input.toString().trim());
  const verbs = doc.verbs().out('array');
  const nouns = doc.nouns().out('array');
  
  console.log(`Detected verbs: ${verbs.join(', ')}`);
  console.log(`Detected nouns: ${nouns.join(', ')}`);
  
  if (verbs.includes('integrate') && nouns.includes('NLP')) {
    console.log('You want to integrate NLP capabilities!');
  }
  
  process.exit();
});