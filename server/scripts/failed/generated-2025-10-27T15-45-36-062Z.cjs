fs.writeFileSync("commands.json", "{}");

let commands = JSON.parse(fs.readFileSync("commands.json", "utf8"));

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(/\s+/);

  if (command === "save") {
    const setName = args[0];
    const cmds = args.slice(1).join(" ");
    commands[setName] = cmds;
    fs.writeFileSync("commands.json", JSON.stringify(commands));
    console.log(`Command set "${setName}" saved.`);
  } else if (command === "load") {
    const setName = args[0];
    if (commands.hasOwnProperty(setName)) {
      console.log(`Loaded command set: ${commands[setName]}`);
      process.stdout.write(`${commands[setName]}\n`);
    } else {
      console.log(`Command set "${setName}" not found.`);
    }
  } else if (command === "list") {
    console.log("Available command sets:");
    for (const setName in commands) {
      console.log(`- ${setName}`);
    }
  } else {
    process.stdout.write(input);
  }
});
