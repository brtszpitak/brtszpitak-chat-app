const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('How can I assist you today? ', (answer) => {
  console.log(`You said: ${answer}`);
  if (answer.toLowerCase().includes('run')) {
    const command = answer.replace(/^run /, '').trim();
    console.log(`Executing command: ${command}`);
    require('child_process').exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`STDERR: ${stderr}`);
        return;
      }
      console.log(`STDOUT: ${stdout}`);
    });
  } else {
    console.log('Unknown command. Try asking me something or use "run" followed by a PowerShell command.');
  }
  rl.close();
});