const fs = require("fs");
const path = require("path");

let logDir = "conversation-logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

class ConversationLog {
  constructor(userId) {
    this.userId = userId;
    this.logPath = path.join(logDir, `${userId}.log`);
    this.load();
  }

  load() {
    if (fs.existsSync(this.logPath)) {
      try {
        this.log = JSON.parse(fs.readFileSync(this.logPath, "utf8"));
      } catch (e) {
        console.error(`Error loading log for ${this.userId}:`, e);
        this.log = [];
      }
    } else {
      this.log = [];
    }
  }

  addEntry(entry) {
    this.log.push(entry);
    fs.writeFileSync(this.logPath, JSON.stringify(this.log));
  }

  getEntries() {
    return this.log;
  }
}

const userId = "Bartosz";
const log = new ConversationLog(userId);

console.log("Previous conversations:");
log.getEntries().forEach((entry, i) => console.log(`${i + 1}. ${entry}`));

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const entry = input.trim();
  if (entry) log.addEntry(entry);
  console.log(`You: ${entry}`);
});

console.log("Type your message...");
