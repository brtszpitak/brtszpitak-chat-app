const fs = require('fs');
const path = require('path');

let conversationHistory = [];
let commandSuggestions = {};

function analyzeConversation() {
  const indexPath = path.join(process.env.USERPROFILE, 'AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations');
  fs.readdir(indexPath, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const filePath = path.join(indexPath, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return console.error(err);
        const words = data.match(/\b\w+\b/g);
        conversationHistory.push(...words);
      });
    });
  });
}

function generateSuggestions() {
  const powershellCommands = require('child_process').execSync('Get-Command -ListImported | Select-Object -ExpandProperty Name').toString().trim().split('\n');
  conversationHistory.forEach(word => {
    powershellCommands.forEach(command => {
      if (command.includes(word)) {
        commandSuggestions[command] = (commandSuggestions[command] || 0) + 1;
      }
    });
  });
}

analyzeConversation();
generateSuggestions();

console.log('Context-aware PowerShell command suggestions:');
Object.entries(commandSuggestions).sort((a, b) => b[1] - a[1]).forEach(([command, score]) => console.log(`  ${command} (${score})`));