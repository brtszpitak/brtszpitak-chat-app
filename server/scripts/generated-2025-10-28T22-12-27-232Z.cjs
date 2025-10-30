const fs = require('fs');
let data = {};

try {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
} catch (e) {}

function saveData() {
  fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
}

process.stdin.setEncoding('utf8');

console.log('Welcome! I\'m here to assist you. Type "exit" to quit.');

process.stdin.on('data', (input) => {
  const query = input.trim();
  if (query === 'exit') process.exit(0);

  console.log(`You asked: ${query}`);
  console.log('Did I get it right? (yes/no)');
  process.stdout.write('> ');

  let response = '';
  process.stdin.on('data', (answer) => {
    response = answer.trim();
    if (response === 'yes' || response === 'no') {
      data[query] = response;
      saveData();
      console.log(`Thanks for the feedback!`);
      process.stdout.write('> ');
      process.stdin.removeListener('data', arguments.callee);
    } else {
      console.log('Invalid response. Please type "yes" or "no".');
      process.stdout.write('> ');
    }
  });
});