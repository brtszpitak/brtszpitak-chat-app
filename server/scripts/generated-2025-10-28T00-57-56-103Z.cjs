const fs = require('fs');

let feedbackData = {};

try {
  const existingFeedback = fs.readFileSync('feedback.json', 'utf8');
  feedbackData = JSON.parse(existingFeedback);
} catch (err) {}

function saveFeedback() {
  fs.writeFileSync('feedback.json', JSON.stringify(feedbackData, null, 2));
}

console.log('Welcome to the AI feedback system!');
console.log('Please respond with "up" or "down" to rate my responses.');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const response = input.trim().toLowerCase();
  if (response === 'up' || response === 'down') {
    const timestamp = new Date().toISOString();
    feedbackData[timestamp] = response;
    saveFeedback();
    console.log(`Thank you for your feedback!`);
  } else {
    console.log('Invalid input. Please respond with "up" or "down".');
  }
});

process.stdin.on('end', () => {
  process.exit();
});