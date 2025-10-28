const fs = require('fs');
let data = {};

try {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

console.log('Provide your feedback (type "exit" to quit):');

process.stdin.on('data', (input) => {
  const line = input.trim();
  if (line === 'exit') process.exit(0);
  
  const [key, value] = line.split(':');
  data[key] = value;
  
  fs.writeFileSync('feedback.json', JSON.stringify(data));
  
  console.log(`Feedback saved: ${key} => ${value}`);
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});