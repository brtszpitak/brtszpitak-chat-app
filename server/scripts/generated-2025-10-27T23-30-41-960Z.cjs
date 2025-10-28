const fs = require('fs');
const moment = require('moment');

let context = {};
let dataPath = 'context.json';

try {
  context = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {}

function saveContext() {
  fs.writeFileSync(dataPath, JSON.stringify(context));
}

function getContext(key) {
  return context[key];
}

function setContext(key, value) {
  context[key] = value;
  saveContext();
}

const now = moment().toISOString();
console.log(`Initialized knowledge graph at ${now}`);

setInterval(() => {
  console.log('Knowledge graph updated:', context);
}, 10000);

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const query = input.trim();
  if (query.startsWith('remember ')) {
    const [_, key, value] = query.split(' ');
    setContext(key, value);
  } else if (query.startsWith('forget ')) {
    const [_, key] = query.split(' ');
    delete context[key];
    saveContext();
  } else if (query === 'context') {
    console.log(context);
  }
});

process.stdin.on('end', () => process.exit());