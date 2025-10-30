fs.writeFileSync('feedback.json', '{}');

let feedback = JSON.parse(fs.readFileSync('feedback.json'));

function ask(question) {
  console.log(`AI: ${question}`);
  let response = prompt('You: ');
  let correct = prompt('Did I get it right? (yes/no): ');
  if(correct.toLowerCase() === 'no') {
    let correction = prompt('Please provide the correct answer: ');
    feedback[question] = { response, correction };
  } else {
    feedback[question] = { response };
  }
  fs.writeFileSync('feedback.json', JSON.stringify(feedback));
}

ask('What is your name?');