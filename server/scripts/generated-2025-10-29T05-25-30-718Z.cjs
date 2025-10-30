const readline = require('readline');
const { NLPManager } = require('@natlang/nlp-manager');

(async () => {
  const nlpManager = new NLPManager();
  await nlpManager.init();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Natural Language Understanding Module');
  console.log('Type "exit" to quit.');

  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', async (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      process.exit(0);
    }

    try {
      const result = await nlpManager.process(input);
      console.log(`Intent: ${result.intent}`);
      console.log(`Entities: ${JSON.stringify(result.entities, null, 2)}`);
      console.log('');
    } catch (err) {
      console.error(err.message);
    }

    rl.prompt();
  });
})();