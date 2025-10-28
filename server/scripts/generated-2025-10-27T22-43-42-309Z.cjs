const fs = require('fs');
let data = {};
try { data = JSON.parse(fs.readFileSync('./feedback.json', 'utf8')); } catch (e) {}
process.stdin.setEncoding('utf8');
console.log('Enter your rating (1-5) and/or feedback:');
process.stdin.on('data', input => {
  const [rating, ...feedback] = input.trim().split('\n');
  if (!isNaN(rating)) data[rating] = (data[rating] || 0) + 1;
  if (feedback.length > 0) data.feedback = data.feedback || []; data.feedback.push(feedback.join('\n'));
  fs.writeFileSync('./feedback.json', JSON.stringify(data, null, 2));
  process.exit();
});