require("readline")
  .createInterface({ input: process.stdin, output: process.stdout })
  .on("line", (line) => {
    const intent = line.trim().toLowerCase();
    if (intent.startsWith("what"))
      console.log("I can help you with various tasks. What would you like to do?");
    else if (intent.includes("list files"))
      require("child_process").exec("dir", (error, stdout, stderr) => {
        console.log(stdout);
      });
    else if (intent.includes("create file")) {
      const filename = line.replace(/^.*create file /, "").trim();
      require("fs").closeSync(require("fs").openSync(filename, "w"));
      console.log(`File ${filename} created.`);
    } else console.log("Sorry, I didn't understand that. Please rephrase your request.");
  })
  .on("close", () => process.exit(0));
