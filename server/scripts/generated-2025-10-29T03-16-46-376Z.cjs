const fs = require('fs');
const path = require('path');

let dataDir = './data';
let userDataPath = path.join(dataDir, 'user.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(userDataPath)) {
  fs.writeFileSync(userDataPath, '{}');
}

let userData = JSON.parse(fs.readFileSync(userDataPath));

function saveUserData() {
  fs.writeFileSync(userDataPath, JSON.stringify(userData));
}

function getUserPreference(key) {
  return userData[key];
}

function setUserPreference(key, value) {
  userData[key] = value;
  saveUserData();
}

function suggest(options) {
  let suggestions = [];
  for (let key in options) {
    if (getUserPreference(key)) {
      suggestions.push(key);
    }
  }
  return suggestions;
}

console.log('Welcome! I can retain and connect information from previous conversations.');

while (true) {
  console.log('What would you like to talk about?');
  let input = prompt('');
  if (input === 'quit') break;

  setUserPreference(input, true);

  let options = ['movies', 'music', 'books'];
  let suggestions = suggest(options);
  if (suggestions.length > 0) {
    console.log(`You might also be interested in: ${suggestions.join(', ')}`);
  }
}

console.log('Goodbye!');