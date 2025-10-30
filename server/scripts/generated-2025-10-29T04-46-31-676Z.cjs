const contextMemory = {};

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if(userInput.startsWith(':remember ')) {
    const [_, key, value] = userInput.split(' ');
    contextMemory[key] = value;
    console.log(`Remembered: ${key} = ${value}`);
  } else if(userInput.startsWith(':recall ')) {
    const [_, key] = userInput.split(' ');
    console.log(contextMemory[key]);
  } else {
    console.log('Unknown command. Use :remember or :recall');
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});