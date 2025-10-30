const fs = require('fs');
let data = {};
if (fs.existsSync('feedback.json')) {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
}
const prompts = [
  'How would you rate my response?',
  'Did I get it right?',
  'Do you want to provide additional information?'
];
for (const prompt of prompts) {
  console.log(prompt);
  const answer = await new Promise(resolve => {
    process.stdin.once('data', data => resolve(data.toString().trim()));
  });
  if (!data[prompt]) data[prompt] = [];
  data[prompt].push(answer);
}
fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
console.log('Thank you for your feedback!');