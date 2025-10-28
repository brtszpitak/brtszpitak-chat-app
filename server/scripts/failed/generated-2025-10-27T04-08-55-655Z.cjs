const NLP = require("compromise");

let windowsCommands = {
  "what is the date": "Get-Date",
  "list files": "dir",
  "create a new folder named": (folderName) => `New-Item -ItemType Directory -Path ${folderName}`,
  "delete file": (fileName) => `Remove-Item ${fileName}`,
};

let nlp = NLP();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  let doc = nlp.text(input.toString().trim());
  let commandFound = false;

  Object.keys(windowsCommands).forEach((command) => {
    if (doc.has(command)) {
      commandFound = true;
      let windowsCommand = windowsCommands[command];
      if (typeof windowsCommand === "function") {
        let match = doc.match(command)[0].match(/(?<=named )(.+)|(?<=file )(.+)/);
        windowsCommand = windowsCommand(match[1] || match[2]);
      }
      console.log(`Running PowerShell command: ${windowsCommand}`);
      require("child_process").exec(
        `powershell -Command "${windowsCommand}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running command: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`STDERR: ${stderr}`);
            return;
          }
          console.log(stdout);
        }
      );
    }
  });

  if (!commandFound) {
    console.log("Unknown command. Please try again.");
  }
});
