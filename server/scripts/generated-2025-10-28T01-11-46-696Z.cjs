const fs = require('fs');
let context = {};

function saveContext() {
  fs.writeFileSync('context.json', JSON.stringify(context, null, 2));
}

function loadContext() {
  try {
    context = JSON.parse(fs.readFileSync('context.json', 'utf8'));
  } catch (e) {}
}

loadContext();

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userRequest = input.trim();
  if (userRequest) {
    console.log(`You said: ${userRequest}`);
    context[userRequest] = context[userRequest] || {};
    console.log('Current context:', JSON.stringify(context, null, 2));
    saveContext();
  }
});

process.stdin.on('end', () => process.stdout.write('Goodbye!'));