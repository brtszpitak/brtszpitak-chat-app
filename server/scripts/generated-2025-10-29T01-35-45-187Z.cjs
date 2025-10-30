fs.writeFileSync('feedback.json', '{}');

const feedback = require('./feedback.json');
let userId = process.argv[2];

if (!userId) {
  console.log('Usage: node script.cjs <user_id>');
  process.exit(1);
}

console.log(`Welcome, ${userId}!`);
console.log('Please rate my response (1-5):');

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
  const rating = parseInt(data.trim());
  if (rating >= 1 && rating <= 5) {
    if (!feedback[userId]) feedback[userId] = { ratings: [] };
    feedback[userId].ratings.push(rating);
    fs.writeFileSync('feedback.json', JSON.stringify(feedback, null, 2));
    console.log(`Thank you for your feedback! Your average rating is ${feedback[userId].ratings.reduce((a, b) => a + b, 0) / feedback[userId].ratings.length}`);
  } else {
    console.log('Invalid rating. Please try again!');
  }
});