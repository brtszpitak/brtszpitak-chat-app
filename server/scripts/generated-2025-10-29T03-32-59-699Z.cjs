const readline = require('readline');
const childProcess = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Alice > ');
rl.prompt();

rl.on('line', (line) => {
  try {
    const command = line.trim().toLowerCase();
    if (command.startsWith('run ')) {
      const cmd = command.substring(4);
      childProcess.execSync(cmd, { shell: true });
      console.log(`Command executed successfully!`);
    } else {
      console.log(`I didn't understand that. Try again!`);
    }
  } catch (err) {
    console.error(`Error executing command: ${err}`);
  } finally {
    rl.prompt();
  }
});

rl.on('close', () => {
  process.exit(0);
});