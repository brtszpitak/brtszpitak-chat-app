const NLP = require('compromise');

console.log('Alice NLP Module Initialized');

process.stdin.setEncoding('utf8');
process.stdin.on('data', async (input) => {
  const nlp = NLP(input.trim());
  const intent = await getIntent(nlp);
  console.log(`Intent: ${intent}`);
  process.stdout.write('> ');
});

async function getIntent(nlp) {
  if (nlp.has('#Verb')) return 'command';
  if (nlp.has('#Question')) return 'query';
  if (nlp.has('what is')) return 'definition';
  // Add more intent handlers as needed
  return 'unknown';
}

process.stdout.write('> ');