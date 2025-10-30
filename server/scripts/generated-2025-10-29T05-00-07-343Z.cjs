fs.writeFileSync('memory.json', '{}');

let memory = require('./memory.json');

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
  const input = data.trim();
  if (input.startsWith('remember ')) {
    const [key, value] = input.substring(9).trim().split('=');
    memory[key.trim()] = value.trim();
    fs.writeFileSync('memory.json', JSON.stringify(memory));
    console.log(`Remembered ${key} as ${value}`);
  } else if (input.startsWith('recall ')) {
    const key = input.substring(7).trim();
    if (memory.hasOwnProperty(key)) {
      console.log(memory[key]);
    } else {
      console.log(`No memory of ${key}`);
    }
  } else {
    console.log('Unknown command');
  }
});