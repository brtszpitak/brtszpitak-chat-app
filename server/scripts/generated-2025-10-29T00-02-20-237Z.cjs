console.log('Rating System Prototype');

const ratings = {};

function processUserInput(input) {
  const [command, ...args] = input.split(' ');
  if (command === 'rate') {
    const [id, rating] = args;
    ratings[id] = parseInt(rating);
    console.log(`Rated response ${id} with ${rating}/5`);
  } else if (command === 'correct') {
    const [id, correction] = args;
    console.log(`Corrected response ${id} to: ${correction}`);
  } else {
    console.log('Invalid command');
  }
}

function askForRating(id) {
  console.log(`Did I get it right? (rate ${id} <1-5>, correct ${id} <correct_response>)`);
}

askForRating(1);

process.stdin.on('data', data => {
  processUserInput(data.toString().trim());
});