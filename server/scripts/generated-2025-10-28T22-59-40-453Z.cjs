const fs = require('fs');
let data = {};

if (fs.existsSync('feedback.json')) {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
}

function rateResponse(response, rating) {
  if (!data.responses) data.responses = {};
  if (!data.responses[response]) data.responses[response] = { ratings: [] };
  data.responses[response].ratings.push(rating);
}

function correctResponse(original, correction) {
  if (!data.corrections) data.corrections = {};
  if (!data.corrections[original]) data.corrections[original] = [];
  data.corrections[original].push(correction);
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [command, ...args] = input.trim().split(' ');
  switch (command) {
    case 'rate':
      rateResponse(args[0], parseInt(args[1]));
      break;
    case 'correct':
      correctResponse(args[0], args[1]);
      break;
  }
  fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
});

console.log('Ready to learn! Use "rate <response> <rating>" or "correct <original> <correction>".');