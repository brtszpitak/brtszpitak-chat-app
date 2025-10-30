const Nlp = require('compromise');

(async () => {
  const nlp = Nlp();

  console.log("NLP Module is ready! Ask me anything:");
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (input) => {
    const text = input.trim();
    if (text === 'exit') process.exit(0);
    
    const doc = nlp(text);
    console.log(`You said: ${doc.text()}`);
    console.log(`Parts of speech: ${doc.out('pos')}`);
    console.log(`Entities: ${doc.entities().out('text')}`);
  });
})();