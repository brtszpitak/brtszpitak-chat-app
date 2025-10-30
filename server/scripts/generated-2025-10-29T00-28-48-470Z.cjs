const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userQuery = line.trim();
  
  if(userQuery !== ''){
    console.log(`AI: I understand you said "${userQuery}".`);
    
    // TO DO: implement natural language understanding logic here
    
    rl.prompt();
  }
}).on('close', () => {
  process.exit(0);
});