const spacy = require('spacy');

(async () => {
  const nlp = await spacy.load('en_core_web_sm');
  const doc = await nlp('What can you do for me today?');
  
  console.log('Entities:', doc.ents);
  console.log('Intent:', get_intent(doc));
})();

function get_intent(doc) {
  if (doc.text.includes('what') && doc.text.includes('can')) return 'query_capabilities';
  else if (doc.text.includes('do') && doc.text.includes('for')) return 'request_task';
  else return 'unknown';
}