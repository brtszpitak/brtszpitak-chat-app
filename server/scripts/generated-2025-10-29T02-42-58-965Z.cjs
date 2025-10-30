const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

rl.question('What would you like to do? ', (answer) => {
  switch (true) {
    case /what is my username/i.test(answer):
      console.log(`Your username is ${require('username')}`);
      break;
    case /list files/i.test(answer):
      require('child_process').exec('dir', (error, stdout, stderr) => {
        if (error) console.error(error);
        else console.log(stdout);
      });
      break;
    default:
      console.log("I didn't understand that. Please try again.");
  }
  rl.close();
});