fs.writeFileSync('context.json', '{}');

let context = JSON.parse(fs.readFileSync('context.json'));

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  let message = input.trim();
  if (message !== '') {
    console.log(`You: ${message}`);
    let response = '';
    // TO DO: implement AI response generation
    console.log(`AI: ${response}`);
    context[message] = response;
    fs.writeFileSync('context.json', JSON.stringify(context));
  }
});