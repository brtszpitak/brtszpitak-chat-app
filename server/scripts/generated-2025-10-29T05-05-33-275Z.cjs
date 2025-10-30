const fs = require('fs');
const path = require('path');

let feedbackData = {};

if (fs.existsSync(path.join(__dirname, 'feedback.json'))) {
  const fileContent = fs.readFileSync(path.join(__dirname, 'feedback.json'), 'utf8');
  feedbackData = JSON.parse(fileContent);
}

function storeFeedback(input, correction) {
  if (!feedbackData[input]) {
    feedbackData[input] = [];
  }
  feedbackData[input].push(correction);
  fs.writeFileSync(path.join(__dirname, 'feedback.json'), JSON.stringify(feedbackData));
}

console.log('Enter "exit" to quit. Enter input and correction separated by commas (e.g., "initial response,corrected response").');
process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const [userInput, userCorrection] = input.trim().split(',');
  if (userInput === 'exit') {
    process.exit();
  }
  storeFeedback(userInput, userCorrection);
  console.log(`Stored feedback: ${userInput} -> ${userCorrection}`);
});

process.stdin.on('end', () => {
  process.exit();
});