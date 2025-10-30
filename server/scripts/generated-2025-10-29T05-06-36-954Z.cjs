const fs = require('fs');
let data = {};

if (fs.existsSync('feedback.json')) {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();
  if (input.startsWith('correct:')) {
    const correction = input.substring(8).trim();
    data[correction] = (data[correction] || 0) + 1;
    fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
    console.log(`Feedback stored. Thank you for helping me improve!`);
  } else {
    console.log(`You said: ${input}`);
  }
});

process.stdin.on('end', () => {
  process.exit();
});