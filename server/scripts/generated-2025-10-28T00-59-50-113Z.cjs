const fs = require('fs');
const readline = require('readline');

let data = {};

if (fs.existsSync('feedback.json')) {
  data = JSON.parse(fs.readFileSync('feedback.json', 'utf8'));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please provide a response to correct or rate: ', (response) => {
  rl.question('Was my response accurate? (1=thumbs-up, 0=thumbs-down): ', (rating) => {
    if (!data[response]) data[response] = { ratings: [] };
    data[response].ratings.push(parseInt(rating));
    fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
    console.log(`Thank you for your feedback!`);
    rl.close();
  });
});