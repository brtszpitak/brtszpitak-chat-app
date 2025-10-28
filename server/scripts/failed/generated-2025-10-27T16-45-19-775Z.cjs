fs.writeFileSync(
  "conversation-history.log",
  `${new Date().toISOString()} ${process.argv.slice(2).join(" ")}\n`,
  { flag: "a" }
);
