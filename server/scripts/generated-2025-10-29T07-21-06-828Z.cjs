const fs = require('fs');
const path = require('path');

let data = {};

if (fs.existsSync(path.join(__dirname, 'feedback.json'))) {
  data = JSON.parse(fs.readFileSync(path.join(__dirname, 'feedback.json'), 'utf8'));
}

function storeFeedback(correction) {
  data[Date.now()] = correction;
  fs.writeFileSync(path.join(__dirname, 'feedback.json'), JSON.stringify(data));
}

console.log('Enter your feedback (or "exit" to quit):');
process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const correction = input.trim();
  if (correction === 'exit') process.exit(0);
  storeFeedback(correction);
  console.log(`Feedback stored. Enter your next feedback (or "exit" to quit):`);
});