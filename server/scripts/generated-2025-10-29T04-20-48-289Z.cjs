const fs = require('fs');
const readline = require('readline');

let conversationHistory = [];
let commandSuggestions = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  conversationHistory.push(line);
  const words = line.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (!commandSuggestions[words[i]]) commandSuggestions[words[i]] = [];
    fs.readdirSync('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules').forEach((module) => {
      const modulePath = `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\${module}\\${module}.psm1`;
      if (fs.existsSync(modulePath)) {
        const content = fs.readFileSync(modulePath, 'utf8');
        if (content.includes(words[i])) commandSuggestions[words[i]].push(`Import-Module ${module}`);
      }
    });
  }
  console.log('Suggestions:');
  Object.keys(commandSuggestions).forEach((key) => {
    console.log(`${key}: ${commandSuggestions[key].join(', ')}`);
  });
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});