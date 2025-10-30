```cjs
console.log('User Feedback Collection System');

const ratings = {};

function askQuestion(question) {
  console.log(`\n${question}`);
  const response = prompt('> ');
  return response;
}

function rateResponse(response, correct) {
  if (!ratings[response]) ratings[response] = { correct: 0, incorrect: 0 };
  correct ? ratings[response].correct++ : ratings[response].incorrect++;
  console.log(`Rating recorded. Correct: ${ratings[response].correct}, Incorrect: ${ratings[response].incorrect}`);
}

function didIGetItRight() {
  const response = askQuestion('Did I get it right? (yes/no)');
  if (response.toLowerCase() === 'yes') return true;
  else if (response.toLowerCase() === 'no') return false;
  else console.log('Invalid response. Please respond with "yes" or "no".');
  didIGetItRight();
}

function main() {
  const question = askQuestion('What is your question?');
  const answer = askQuestion(`My response: ${question}...`);
  const correct = didIGetItRight();
  rateResponse(answer, correct);
  console.log('\nRatings:', ratings);
}

main();
```