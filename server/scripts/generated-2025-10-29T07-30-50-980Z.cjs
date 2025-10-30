const fs = require('fs');
const path = require('path');

let corrections = {};

if (fs.existsSync(path.join(__dirname, 'corrections.json'))) {
  corrections = JSON.parse(fs.readFileSync(path.join(__dirname, 'corrections.json'), 'utf8'));
}

function learnFromCorrection(prompt, correction) {
  if (!corrections[prompt]) corrections[prompt] = [];
  corrections[prompt].push(correction);
  fs.writeFileSync(path.join(__dirname, 'corrections.json'), JSON.stringify(corrections, null, 2));
}

learnFromCorrection('What is your name?', 'My name is Alice.');
console.log(corrections);