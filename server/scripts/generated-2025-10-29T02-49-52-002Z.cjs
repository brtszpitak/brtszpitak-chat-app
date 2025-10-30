const NaturalLanguageUnderstanding = require('stanford-corenlp');

(async () => {
  const nlu = new NaturalLanguageUnderstanding({
    server: 'http://localhost:9000',
  });

  await nlu.boot();

  console.log('Natural Language Understanding module is ready!');

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', async (input) => {
    try {
      const annotation = await nlu.annotate(input.toString().trim());
      console.log(annotation);
    } catch (error) {
      console.error(error);
    }
  });

  process.stdin.on('end', () => {
    process.stdout.write('Goodbye!');
  });
})();