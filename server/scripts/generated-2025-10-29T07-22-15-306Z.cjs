const fs = require('fs');
const path = require('path');

let feedbackDB = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'feedback.json'), 'utf8');
  feedbackDB = JSON.parse(data);
} catch (err) {}

function storeFeedback(correction) {
  feedbackDB[Date.now()] = correction;
  fs.writeFileSync(path.join(__dirname, 'feedback.json'), JSON.stringify(feedbackDB));
}

console.log('Enter your corrections (type "exit" to quit):');
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(input) {
  const correction = input.toString().trim();
  if (correction === 'exit') process.exit(0);
  storeFeedback(correction);
  console.log(`Thank you for your feedback!`);
});

process.stdin.on('end', function() {
  process.exit(0);
});