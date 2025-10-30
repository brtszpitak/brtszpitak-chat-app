const readline = require('readline');
const { NLU } = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const nlu = new NLU();

rl.question('Talk to me: ', (input) => {
  const intent = nlu.intent(input);
  console.log(`You meant to ${intent}`);
  rl.close();
});