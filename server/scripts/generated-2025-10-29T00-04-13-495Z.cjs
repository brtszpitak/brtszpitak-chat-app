```cjs
const fs = require('fs');
let interactions = {};

if (fs.existsSync('interactions.json')) {
  interactions = JSON.parse(fs.readFileSync('interactions.json', 'utf8'));
}

function saveInteractions() {
  fs.writeFileSync('interactions.json', JSON.stringify(interactions));
}

process.stdin.setEncoding('utf8');

console.log('Welcome! I\'m Alice. How can I assist you today?');

process.stdin.on('data', (input) => {
  const response = `You said: ${input.trim()}`;
  console.log(response);
  
  console.log('Did I get it right? (yes/no)');
  process.stdin.once('data', (feedback) => {
    feedback = feedback.trim().toLowerCase();
    if (feedback === 'yes') {
      interactions[input.trim()] = { response, accuracy: 1 };
    } else if (feedback === 'no') {
      console.log('Please provide the correct response:');
      process.stdin.once('data', (correctResponse) => {
        interactions[input.trim()] = { response: correctResponse.trim(), accuracy: 0 };
        saveInteractions();
        console.log('Thank you for correcting me!');
      });
    } else {
      console.log('Invalid feedback. Please respond with "yes" or "no".');
    }
    saveInteractions();
  });
});

process.stdin.on('end', () => {
  process.exit();
});
```