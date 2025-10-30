const fs = require('fs');
let feedbackData = {};

try {
  const existingFeedback = fs.readFileSync('feedback.json', 'utf8');
  feedbackData = JSON.parse(existingFeedback);
} catch (err) {}

console.log('Provide your rating (1-5) and/or correct response:');
process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const [rating, correction] = input.trim().split('\n');
  const timestamp = new Date().toISOString();
  feedbackData[timestamp] = { rating: parseInt(rating), correction };
  fs.writeFileSync('feedback.json', JSON.stringify(feedbackData, null, 2));
  console.log(`Feedback saved. Thank you!`);
  process.exit(0);
});