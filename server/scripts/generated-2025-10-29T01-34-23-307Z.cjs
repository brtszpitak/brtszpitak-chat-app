const fs = require('fs');
let data = {};

try {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
} catch (e) {}

const rate = (input, correct) => {
  if (!data[input]) data[input] = { correct: 0, incorrect: 0 };
  correct ? data[input].correct++ : data[input].incorrect++;
  fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const [input, response, correct] = chunk.trim().split(',');
  rate(input, correct === 'true');
  console.log(`You rated "${response}" as ${correct ? '' : 'in'}correct for input "${input}".`);
});

console.log('Enter input,response,correct (e.g., "hello","world",true)');